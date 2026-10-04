/* ═══════════════════════════════════════════════════════════
   ROBOT « ACTUALITÉ »
   Lancé toutes les heures par .github/workflows/news.yml :
   1. lit les flux RSS de sources.mjs ;
   2. range les articles par jour (heure de Paris), garde 14 jours ;
   3. deux fois par jour (matin, soir), rédige un briefing par thème
      avec Gemini (clé GEMINI_API_KEY dans les secrets du dépôt), à
      partir des titres et chapôs uniquement. Sans clé ou si Gemini ne
      répond pas : sélection automatique des sujets les plus repris.
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
const BRIEFING_MAX_ITEMS = 90;
const BRIEFING_MAX_PROMPT_CHARS = 40000;
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta';
// Repli si la liste des modèles est illisible. Sinon on prend les modèles
// « flash » proposés par Google, du plus récent au plus ancien.
const GEMINI_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest'];
const GEMINI_MAX_MODELS = 5;
const GEMINI_BUSY_WAITS_MS = [8000, 20000]; // modèle saturé (503) : on réessaie après ces pauses
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

/* ── Briefing (Gemini) ─────────────────────────────────────── */

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

// Erreurs gardées dans state.json (public) et affichées sur la page du
// passage dans Actions, pour comprendre un échec sans lire tout le journal.
const briefingErrors = [];
const reportError = (message) => {
  briefingErrors.push(message.slice(0, 400));
  console.log(`::warning title=Briefing::${message.replace(/\s+/g, ' ').slice(0, 400)}`);
};

const geminiFetch = (url, key, options = {}) =>
  fetch(url, { ...options, headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key } });

// Modèles disponibles : on lit la liste (les noms changent) et on garde
// ceux de la liste de préférence, sinon un modèle « flash » proposé.
let modelList = null;
const deadModels = new Set(); // modèles retirés (404) : plus essayés pendant ce passage

const modelVersion = (id) => {
  const match = id.match(/^gemini-(\d+(?:\.\d+)?)-flash/);
  return match ? Number(match[1]) : 0;
};

// Ordre : flash numérotés du plus récent, alias « latest », puis versions « lite ».
const rankModels = (ids) => {
  const flash = ids.filter((id) => /^gemini-[\d.]+-flash$/.test(id)).sort((a, b) => modelVersion(b) - modelVersion(a));
  const lite = ids.filter((id) => /^gemini-[\d.]+-flash-lite$/.test(id)).sort((a, b) => modelVersion(b) - modelVersion(a));
  const aliases = GEMINI_MODELS.filter((id) => ids.includes(id));
  const ordered = [...flash.slice(0, 2), aliases[0], ...lite.slice(0, 1), ...aliases.slice(1), ...flash.slice(2)];
  return ordered.filter((id, index) => id && ordered.indexOf(id) === index);
};

const availableModels = async (key) => {
  if (modelList) return modelList;
  try {
    const response = await geminiFetch(`${GEMINI_API}/models?pageSize=200`, key);
    const body = await response.text();
    if (!response.ok) throw new Error(`HTTP ${response.status} ${body.slice(0, 200)}`);
    const models = (JSON.parse(body).models || []).filter((model) =>
      (model.supportedGenerationMethods || []).includes('generateContent')
    );
    modelList = rankModels(models.map((model) => String(model.name).replace(/^models\//, '')));
    console.log(`Modèles retenus : ${modelList.join(', ')}`);
  } catch (error) {
    reportError(`Liste des modèles illisible (${error.message}), liste par défaut.`);
    modelList = [];
  }
  if (!modelList.length) modelList = GEMINI_MODELS.slice();
  return modelList;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const requestModel = async (key, model, prompt) => {
  const response = await geminiFetch(`${GEMINI_API}/models/${model}:generateContent`, key, {
    method: 'POST',
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
    })
  });
  const text = await response.text();
  if (!response.ok) {
    const error = new Error(`${model} : HTTP ${response.status} ${text.slice(0, 300)}`);
    error.status = response.status;
    // Google indique parfois le modèle qui remplace celui-ci.
    const suggested = text.match(/use models\/(gemini-[\w.-]+)/);
    if (suggested) error.suggested = suggested[1];
    throw error;
  }
  const candidate = (JSON.parse(text).candidates || [])[0];
  const content =
    candidate && candidate.content && Array.isArray(candidate.content.parts)
      ? candidate.content.parts.map((part) => part.text || '').join('')
      : '';
  if (!content) throw new Error(`${model} : réponse vide (${candidate ? candidate.finishReason : 'aucun candidat'})`);
  return extractJson(content);
};

const callModel = async (prompt) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('clé GEMINI_API_KEY absente des secrets du dépôt');
  const queue = (await availableModels(key)).filter((model) => !deadModels.has(model));
  let lastError = null;
  let tried = 0;
  while (queue.length && tried < GEMINI_MAX_MODELS) {
    const model = queue.shift();
    tried += 1;
    for (let attempt = 0; attempt <= GEMINI_BUSY_WAITS_MS.length; attempt += 1) {
      try {
        return { model, data: await requestModel(key, model, prompt) };
      } catch (error) {
        lastError = error;
        reportError(error.message);
        // Saturé : on patiente puis on réessaie le même modèle.
        if ((error.status === 503 || error.status === 500) && attempt < GEMINI_BUSY_WAITS_MS.length) {
          await wait(GEMINI_BUSY_WAITS_MS[attempt]);
          continue;
        }
        if (error.status === 404) {
          deadModels.add(model);
          if (error.suggested && !deadModels.has(error.suggested) && !queue.includes(error.suggested)) {
            queue.unshift(error.suggested);
          }
        }
        break;
      }
    }
    // Clé refusée : inutile d'essayer d'autres modèles.
    if (lastError && (lastError.status === 401 || lastError.status === 403)) break;
    if (lastError && lastError.status === 400 && /API_KEY|api key/i.test(lastError.message)) break;
  }
  throw lastError || new Error('aucun modèle');
};

/* ── Secours sans IA : sujets les plus repris ──────────────── */

const STOP_WORDS = new Set(
  'les des une un le la de du et en au aux pour par sur dans avec sans est sont ont qui que quoi cette ces sa son ses leur leurs plus pas ne il elle ils elles on nous vous apres avant contre entre selon comme mais ou donc lors face fait faire etre avoir deux trois tout tous direct video'.split(' ')
);

const titleWords = (title) =>
  new Set(
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .split(' ')
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );

// Regroupe les titres qui partagent des mots, puis garde les sujets
// repris par le plus de sources.
const autoPoints = (items) => {
  const clusters = [];
  items.forEach((item) => {
    const words = titleWords(item.title);
    const cluster = clusters.find((candidate) => {
      let shared = 0;
      words.forEach((word) => {
        if (candidate.words.has(word)) shared += 1;
      });
      return shared >= 3 || (shared >= 2 && shared / Math.max(1, Math.min(words.size, candidate.words.size)) >= 0.5);
    });
    if (cluster) {
      cluster.items.push(item);
      words.forEach((word) => cluster.words.add(word));
    } else {
      clusters.push({ items: [item], words });
    }
  });
  return clusters
    .map((cluster) => ({ ...cluster, sources: new Set(cluster.items.map((item) => item.source)).size }))
    .sort((a, b) => b.sources - a.sources || b.items.length - a.items.length)
    .slice(0, 5)
    .map((cluster) => {
      const best = cluster.items.reduce((a, b) => ((b.summary || '').length > (a.summary || '').length ? b : a));
      return {
        title: cluster.items[0].title,
        summary: best.summary || '',
        context: '',
        sources: cluster.items.slice(0, 4).map((item) => ({ title: item.title, source: item.source, link: item.link }))
      };
    });
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

const lastBriefingTime = (days, due) => {
  let last = 0;
  days.forEach((day) => {
    day.briefings.forEach((briefing) => {
      // Le briefing qu'on refait ne compte pas.
      if (day.date === due.day && briefing.slot === due.slot) return;
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
  const done = existing && existing.briefings.find((briefing) => briefing.slot === slot.id);
  // Un briefing de secours (IA indisponible) est refait au passage suivant.
  if (!force && done && !done.fallback) return null;
  return { day, slot: slot.id };
};

const makeBriefing = async (days, allItems, now, due) => {
  const last = lastBriefingTime(days, due);
  const hour = 3600 * 1000;
  let from = now.getTime() - BRIEFING_MAX_WINDOW_H * hour;
  if (last > from) from = Math.min(last, now.getTime() - BRIEFING_MIN_WINDOW_H * hour);
  const fromDate = new Date(from);

  const briefing = { slot: due.slot, generatedAt: now.toISOString(), from: fromDate.toISOString(), themes: {} };
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
      continue;
    }
    const { prompt, used } = buildPrompt(theme, items, new Date(themeFrom), now);
    try {
      console.log(`Briefing ${theme} : ${used} dépêches`);
      const { model, data } = await callModel(prompt);
      briefing.model = model;
      briefing.themes[theme] = { points: cleanPoints(data, items.slice(0, used)), count: used };
    } catch (error) {
      reportError(`Briefing ${theme} impossible : ${error.message}`);
      briefing.themes[theme] = { points: autoPoints(items), count: items.length, auto: true };
      briefing.fallback = true;
    }
  }
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
  // si Gemini est indisponible (le briefing de secours reste alors).
  const due = dueSlot(days, now);
  const dueKey = due ? `${due.day}-${due.slot}` : '';
  const attempts = state.briefingAttempts && state.briefingAttempts.key === dueKey ? state.briefingAttempts.count : 0;
  if (due && (attempts < 3 || process.env.FORCE_BRIEFING === 'true')) {
    state.briefingAttempts = { key: dueKey, count: attempts + 1 };
    const briefing = await makeBriefing(days, allItems, now, due);
    const day = ensureDay(days, due.day);
    const previous = day.briefings.find((existing) => existing.slot === briefing.slot);
    // Un nouvel essai raté ne remplace pas un briefing déjà rédigé par l'IA.
    if (!(briefing.fallback && previous && !previous.fallback)) {
      day.briefings = day.briefings.filter((existing) => existing !== previous);
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
