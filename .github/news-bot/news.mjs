/* ═══════════════════════════════════════════════════════════
   ROBOT « ACTUALITÉ »
   Lancé toutes les heures par .github/workflows/news.yml :
   1. lit les flux RSS de sources.mjs ;
   2. range les articles par jour (heure de Paris), garde 14 jours ;
   3. deux fois par jour (matin, soir), rédige un briefing par thème
      avec GitHub Models, à partir des titres et chapôs uniquement.
   Sortie (branche « news », lue par l'onglet Actualité) :
     index.json             { updatedAt, days: ['2026-10-04', …], themes }
     days/AAAA-MM-JJ.json   { date, items: […], briefings: […] }
     state.json             état interne du robot
   Usage : node news.mjs <dossier-de-sortie>
   ═══════════════════════════════════════════════════════════ */

import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { SOURCES, THEMES } from './sources.mjs';

const OUT_DIR = process.argv[2] || 'news-data';
const DAYS_DIR = path.join(OUT_DIR, 'days');
const KEEP_DAYS = 14;
const TIME_ZONE = 'Europe/Paris';
const SUMMARY_MAX = 400;
const FETCH_TIMEOUT_MS = 20000;
const USER_AGENT = 'MyDeskOnline-news-bot/1.0 (+https://github.com/Radvak/MyDeskOnline)';

// Créneaux du briefing (heure de Paris). Le robot rattrape un créneau
// manqué au passage suivant (les tâches planifiées GitHub ont du retard).
const BRIEFING_SLOTS = [
  { id: 'matin', hour: 6 },
  { id: 'soir', hour: 18 }
];
const BRIEFING_MAX_WINDOW_H = 24;
const BRIEFING_MIN_WINDOW_H = 8;
const BRIEFING_MAX_ITEMS = 60;
const BRIEFING_MAX_PROMPT_CHARS = 18000; // ≈ 6 000 jetons : sous la limite de 8 000 de l'offre gratuite
const MODELS_ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const MODELS = ['openai/gpt-4.1', 'openai/gpt-4.1-mini', 'openai/gpt-4o', 'openai/gpt-4o-mini'];
// L'actu juridique est plus lente : un seul briefing par jour, sur 24 h.
const DAILY_THEMES = ['juridique'];

/* ── Dates ─────────────────────────────────────────────────── */

const parisParts = (date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type).value;
  return { day: `${get('year')}-${get('month')}-${get('day')}`, hour: Number(get('hour')) };
};

const parisTime = (date) =>
  new Intl.DateTimeFormat('fr-FR', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);

/* ── Lecture des flux ──────────────────────────────────────── */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', laquo: '«', raquo: '»', hellip: '…', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', ndash: '–', mdash: '—', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ecirc: 'ê', ocirc: 'ô', icirc: 'î', ucirc: 'û' };

const decodeEntities = (text) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });

// Texte brut d'un champ : enlève CDATA, balises et entités (les entités
// peuvent être doublées, ex. « &amp;eacute; »).
const cleanText = (raw) => {
  if (!raw) return '';
  let text = raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  text = decodeEntities(text);
  text = text.replace(/<[^>]*>/g, ' ');
  text = decodeEntities(text);
  return text.replace(/\s+/g, ' ').trim();
};

const shorten = (text, max) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : max).trim()}…`;
};

const tagContent = (block, names) => {
  for (const name of names) {
    const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'));
    if (match && cleanText(match[1])) return match[1];
  }
  return '';
};

const entryLink = (block) => {
  const text = cleanText(tagContent(block, ['link']));
  if (/^https?:\/\//.test(text)) return text;
  const atom = block.match(/<link\b[^>]*href="([^"]+)"[^>]*>/i);
  if (atom) return decodeEntities(atom[1]);
  const guid = cleanText(tagContent(block, ['guid', 'id']));
  return /^https?:\/\//.test(guid) ? guid : '';
};

const parseFeed = (xml) => {
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi) || [];
  return blocks
    .map((block) => {
      const title = cleanText(tagContent(block, ['title']));
      const link = entryLink(block);
      const summary = cleanText(tagContent(block, ['description', 'summary', 'content:encoded', 'content']));
      const rawDate = cleanText(tagContent(block, ['pubDate', 'dc:date', 'published', 'updated']));
      const time = rawDate ? Date.parse(rawDate) : NaN;
      return { title, link, summary, time: Number.isFinite(time) ? time : null };
    })
    .filter((entry) => entry.title && entry.link);
};

const fetchFeed = async (source) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(source.url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return parseFeed(await response.text());
  } finally {
    clearTimeout(timer);
  }
};

// Enlève les marqueurs de suivi (#xtor=…, ?utm_…) pour reconnaître un même article.
const cleanLink = (link) => link.replace(/#xtor=.*$/, '').replace(/[?&]utm_[^#]*$/, '');

const itemId = (link) => createHash('sha1').update(link).digest('hex').slice(0, 12);

/* ── Stockage ──────────────────────────────────────────────── */

const readJson = async (file, fallback) => {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
};

const loadDays = async () => {
  const days = new Map();
  let files = [];
  try {
    files = await readdir(DAYS_DIR);
  } catch {
    files = [];
  }
  for (const file of files) {
    if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(file)) continue;
    const data = await readJson(path.join(DAYS_DIR, file), null);
    if (data && Array.isArray(data.items)) {
      days.set(data.date, { date: data.date, items: data.items, briefings: data.briefings || [] });
    }
  }
  return days;
};

const ensureDay = (days, date) => {
  if (!days.has(date)) days.set(date, { date, items: [], briefings: [] });
  return days.get(date);
};

/* ── Briefing (GitHub Models) ──────────────────────────────── */

const SYSTEM_PROMPT = `Tu rédiges une revue de presse pour un étudiant en droit qui veut entretenir sa culture générale sur l'actualité.
On te donne des dépêches numérotées (titre et chapô) publiées par des médias et institutions français.

Consignes :
- Retiens les 4 à 7 sujets les plus importants pour la culture générale : géopolitique, institutions, vie politique, économie, grandes décisions de justice et réformes. Écarte les faits divers sans portée nationale, le sport, les people, les annonces d'émissions, de colloques ou d'événements.
- Regroupe les dépêches qui parlent du même sujet.
- Pour chaque sujet :
  • "titre" : court et factuel, 12 mots maximum ;
  • "resume" : 2 ou 3 phrases simples (qui, quoi, où, quand, chiffres clés) ;
  • "contexte" : une phrase qui explique pourquoi c'est important ou définit la notion à connaître (institution, procédure, enjeu) ;
  • "sources" : les numéros des dépêches utilisées.
- N'utilise que les informations des dépêches. N'invente aucun fait, chiffre ou nom ; tu peux seulement ajouter une définition générale dans "contexte". Si une information est présentée comme incertaine, garde cette prudence.
- Ton neutre, sans opinion. Écris en français.
- Classe les sujets du plus important au moins important.
- S'il n'y a rien d'important, renvoie une liste vide.

Réponds uniquement avec un objet JSON : {"points":[{"titre":"…","resume":"…","contexte":"…","sources":[1,2]}]}`;

const THEME_HINTS = {
  monde: 'Thème : actualité internationale et géopolitique.',
  france: 'Thème : France, vie politique et économie.',
  juridique:
    "Thème : justice et droit. Précise la juridiction, le type de décision (QPC, arrêt, avis, ordonnance…) et sa portée. Une affaire étrangère n'est retenue que si elle est majeure. Un procès n'est retenu que s'il a une portée nationale ou juridique."
};

const buildPrompt = (theme, items, from, to) => {
  const header = `${THEME_HINTS[theme]}\nPériode : du ${parisTime(from)} au ${parisTime(to)} (heure de Paris).\n\nDépêches :\n`;
  const lines = [];
  let length = header.length;
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const summary = shorten(item.summary || '', 240);
    const line = `[${index + 1}] (${item.source}, ${parisTime(new Date(item.date))}) ${item.title}${summary ? ` — ${summary}` : ''}`;
    if (length + line.length + 1 > BRIEFING_MAX_PROMPT_CHARS) break;
    lines.push(line);
    length += line.length + 1;
  }
  return { prompt: header + lines.join('\n'), used: lines.length };
};

const extractJson = (text) => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('réponse sans JSON');
  return JSON.parse(text.slice(start, end + 1));
};

const MODELS_HEADERS = (token) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
  'X-GitHub-Api-Version': '2022-11-28'
});

// Erreurs gardées dans state.json (public) et affichées sur la page du
// passage dans Actions, pour comprendre un échec sans lire tout le journal.
const briefingErrors = [];
const reportError = (message) => {
  briefingErrors.push(message.slice(0, 400));
  console.log(`::warning title=Briefing::${message.replace(/\s+/g, ' ').slice(0, 400)}`);
};

// Modèles disponibles : on lit le catalogue (les modèles changent) et on
// garde ceux de la liste de préférence, sinon les premiers proposés.
let modelList = null;
const availableModels = async (token) => {
  if (modelList) return modelList;
  try {
    const response = await fetch('https://models.github.ai/catalog/models', { headers: MODELS_HEADERS(token) });
    if (!response.ok) throw new Error(`catalogue : HTTP ${response.status}`);
    const catalog = await response.json();
    const ids = (Array.isArray(catalog) ? catalog : catalog.data || []).map((model) => model.id).filter(Boolean);
    const preferred = MODELS.filter((id) => ids.includes(id));
    const others = ids.filter((id) => id.startsWith('openai/gpt') && !preferred.includes(id));
    modelList = [...preferred, ...others].slice(0, 4);
    console.log(`Modèles retenus : ${modelList.join(', ')}`);
  } catch (error) {
    reportError(`Catalogue des modèles illisible (${error.message}), liste par défaut.`);
    modelList = MODELS.slice(0, 4);
  }
  if (!modelList.length) modelList = MODELS.slice(0, 4);
  return modelList;
};

const requestModel = async (token, model, prompt, tuned) => {
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ]
  };
  // Certains modèles refusent ces réglages : on réessaie sans.
  if (tuned) body.temperature = 0.2;
  const response = await fetch(MODELS_ENDPOINT, { method: 'POST', headers: MODELS_HEADERS(token), body: JSON.stringify(body) });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(`${model} : HTTP ${response.status} ${text.slice(0, 300)}`);
    error.status = response.status;
    throw error;
  }
  const content = JSON.parse(text).choices?.[0]?.message?.content || '';
  return extractJson(content);
};

const callModel = async (prompt) => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('GITHUB_TOKEN absent');
  let lastError = null;
  for (const model of await availableModels(token)) {
    for (const tuned of [true, false]) {
      try {
        return { model, data: await requestModel(token, model, prompt, tuned) };
      } catch (error) {
        lastError = error;
        reportError(error.message);
        // 400 : peut-être un réglage refusé, on réessaie sans ; sinon modèle suivant.
        if (error.status !== 400) break;
      }
    }
    // Quota dépassé ou droits manquants : inutile d'essayer d'autres modèles.
    if (lastError && (lastError.status === 401 || lastError.status === 403 || lastError.status === 429)) break;
  }
  throw lastError || new Error('aucun modèle');
};

const cleanPoints = (data, items) => {
  const points = Array.isArray(data && data.points) ? data.points : [];
  return points
    .map((point) => {
      const refs = Array.isArray(point.sources) ? point.sources : [];
      const sources = [];
      refs.forEach((ref) => {
        const item = items[Number(ref) - 1];
        if (item && !sources.some((source) => source.link === item.link)) {
          sources.push({ title: item.title, source: item.source, link: item.link });
        }
      });
      return {
        title: String(point.titre || '').trim(),
        summary: String(point.resume || '').trim(),
        context: String(point.contexte || '').trim(),
        sources: sources.slice(0, 4)
      };
    })
    .filter((point) => point.title && point.summary)
    .slice(0, 8);
};

const lastBriefingTime = (days) => {
  let last = 0;
  days.forEach((day) => {
    day.briefings.forEach((briefing) => {
      last = Math.max(last, Date.parse(briefing.generatedAt) || 0);
    });
  });
  return last;
};

const dueSlot = (days, now) => {
  const { day, hour } = parisParts(now);
  const slot = [...BRIEFING_SLOTS].reverse().find((candidate) => hour >= candidate.hour);
  if (!slot) return null;
  const existing = days.get(day);
  const force = process.env.FORCE_BRIEFING === 'true';
  if (!force && existing && existing.briefings.some((briefing) => briefing.slot === slot.id)) return null;
  return { day, slot: slot.id };
};

const makeBriefing = async (days, allItems, now, due) => {
  const last = lastBriefingTime(days);
  const hour = 3600 * 1000;
  let from = now.getTime() - BRIEFING_MAX_WINDOW_H * hour;
  if (last > from) from = Math.min(last, now.getTime() - BRIEFING_MIN_WINDOW_H * hour);
  const fromDate = new Date(from);

  const briefing = { slot: due.slot, generatedAt: now.toISOString(), from: fromDate.toISOString(), themes: {} };
  let success = 0;
  for (const theme of Object.keys(THEMES)) {
    const daily = DAILY_THEMES.includes(theme);
    if (daily && due.slot !== BRIEFING_SLOTS[0].id) continue;
    const themeFrom = daily ? now.getTime() - 24 * hour : from;
    const seenTitles = new Set();
    const items = allItems
      .filter((item) => item.theme === theme && Date.parse(item.date) >= themeFrom)
      .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
      .filter((item) => {
        const key = item.title.toLowerCase();
        if (seenTitles.has(key)) return false;
        seenTitles.add(key);
        return true;
      })
      .slice(0, BRIEFING_MAX_ITEMS);
    if (items.length < 2) {
      briefing.themes[theme] = { points: [], count: items.length };
      success += 1;
      continue;
    }
    const { prompt, used } = buildPrompt(theme, items, new Date(themeFrom), now);
    try {
      console.log(`Briefing ${theme} : ${used} dépêches`);
      const { model, data } = await callModel(prompt);
      briefing.model = model;
      briefing.themes[theme] = { points: cleanPoints(data, items.slice(0, used)), count: used };
      success += 1;
    } catch (error) {
      reportError(`Briefing ${theme} impossible : ${error.message}`);
      briefing.themes[theme] = { points: [], count: used, error: true };
    }
  }
  if (!success) return null;
  return briefing;
};

/* ── Programme principal ───────────────────────────────────── */

const main = async () => {
  const now = new Date();
  await mkdir(DAYS_DIR, { recursive: true });
  const days = await loadDays();
  const state = await readJson(path.join(OUT_DIR, 'state.json'), { sources: {} });
  const cutoff = now.getTime() - KEEP_DAYS * 24 * 3600 * 1000;

  const known = new Set();
  days.forEach((day) => day.items.forEach((item) => known.add(item.id)));

  let added = 0;
  const failures = [];
  for (const source of SOURCES) {
    let entries = [];
    try {
      entries = await fetchFeed(source);
    } catch (error) {
      failures.push(`${source.id} (${error.message})`);
      continue;
    }
    const sourceKnown = Boolean(state.sources[source.id]);
    for (const entry of entries) {
      entry.link = cleanLink(entry.link);
      const id = itemId(entry.link);
      if (known.has(id)) continue;
      // Sans date : on prend l'heure de découverte, sauf au tout premier
      // passage sur la source (sinon tout son historique arriverait « aujourd'hui »).
      let time = entry.time;
      if (time === null) {
        if (!sourceKnown) continue;
        time = now.getTime();
      }
      if (time < cutoff || time > now.getTime() + 3600 * 1000) continue;
      const item = {
        id,
        title: entry.title,
        summary: shorten(entry.summary === entry.title ? '' : entry.summary, SUMMARY_MAX),
        link: entry.link,
        source: source.name,
        theme: source.theme,
        date: new Date(Math.min(time, now.getTime())).toISOString()
      };
      ensureDay(days, parisParts(new Date(item.date)).day).items.push(item);
      known.add(id);
      added += 1;
    }
    state.sources[source.id] = { lastOk: now.toISOString(), entries: entries.length };
  }
  console.log(`${added} nouveaux articles.`);
  if (failures.length) console.warn(`Flux en échec : ${failures.join(', ')}`);

  // Ménage : jours trop anciens.
  const oldest = parisParts(new Date(cutoff)).day;
  for (const date of [...days.keys()]) {
    if (date < oldest) {
      days.delete(date);
      await unlink(path.join(DAYS_DIR, `${date}.json`)).catch(() => {});
    }
  }

  const allItems = [];
  days.forEach((day) => allItems.push(...day.items));

  // Au plus 3 essais par créneau, pour ne pas épuiser le quota gratuit
  // si le service de modèles est indisponible.
  const due = dueSlot(days, now);
  const dueKey = due ? `${due.day}-${due.slot}` : '';
  const attempts = state.briefingAttempts && state.briefingAttempts.key === dueKey ? state.briefingAttempts.count : 0;
  if (due && (attempts < 3 || process.env.FORCE_BRIEFING === 'true')) {
    state.briefingAttempts = { key: dueKey, count: attempts + 1 };
    const briefing = await makeBriefing(days, allItems, now, due);
    if (briefing) {
      const day = ensureDay(days, due.day);
      day.briefings = day.briefings.filter((existing) => existing.slot !== briefing.slot);
      day.briefings.push(briefing);
    }
  }

  for (const day of days.values()) {
    day.items.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    await writeFile(path.join(DAYS_DIR, `${day.date}.json`), JSON.stringify(day));
  }
  const index = {
    updatedAt: now.toISOString(),
    days: [...days.keys()].sort().reverse(),
    themes: THEMES,
    sources: SOURCES.map(({ name, theme, home }) => ({ name, theme, home }))
  };
  await writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(index));
  if (due) state.lastBriefing = { at: now.toISOString(), slot: due.slot, errors: briefingErrors };
  await writeFile(path.join(OUT_DIR, 'state.json'), JSON.stringify(state, null, 1));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
