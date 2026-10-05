/* ═══════════════════════════════════════════════════════════
   ONGLET ACTUALITÉ
   Lit les fichiers publiés par le robot (.github/news-bot) dans la
   branche « news » du dépôt :
     index.json            jours disponibles, heure de mise à jour
     days/AAAA-MM-JJ.json  articles (titre, chapô, lien) et briefings
     weeks/AAAA-MM-JJ.json résumé de la semaine (date du lundi)
   Le briefing est rédigé par IA à partir des titres et chapôs ; les
   articles renvoient vers le site de la source.
   Rien n'est synchronisé : seul un cache local (dernier jour lu, heure
   de dernière visite) est gardé sur l'appareil.
   ═══════════════════════════════════════════════════════════ */

const NEWS_DATA_URL = 'https://raw.githubusercontent.com/Radvak/MyDeskOnline/news/';
const NEWS_CACHE_KEY = 'mydesk-news-cache';
const NEWS_SEEN_KEY = 'mydesk-news-seen';
const NEWS_THEME_KEY = 'mydesk-news-theme';
const NEWS_MODE_KEY = 'mydesk-news-mode';
const NEWS_REFRESH_MS = 15 * 60 * 1000;
const NEWS_HEADLINES_STEP = 40;
const NEWS_THEME_ORDER = ['monde', 'france', 'juridique'];
// Lancer le robot depuis l'app (bouton « Générer le résumé » et rattrapage
// automatique d'un résumé manquant) : jeton GitHub À PART de celui de la
// synchro, limité au dépôt avec la seule permission Actions, gardé sur
// l'appareil (jamais synchronisé).
const NEWS_REPO_API = 'https://api.github.com/repos/Radvak/MyDeskOnline/actions/workflows/news.yml/dispatches';
const NEWS_ACTIONS_PAGE = 'https://github.com/Radvak/MyDeskOnline/actions/workflows/news.yml';
const NEWS_TOKEN_PAGE = 'https://github.com/settings/personal-access-tokens/new';
const NEWS_ROBOT_TOKEN_KEY = 'mydesk-news-robot-token';
const NEWS_AUTO_KEY = 'mydesk-news-auto-at';
const NEWS_SLOT_HOURS = { matin: 6, soir: 18 };
const NEWS_AUTO_DELAY_MS = 20 * 60 * 1000; // créneau ouvert depuis 20 min sans résumé
const NEWS_AUTO_GAP_MS = 45 * 60 * 1000; // au plus une demande automatique / 45 min
const NEWS_POLL_MS = 30 * 1000;
const NEWS_POLL_MAX_MS = 8 * 60 * 1000;

const NEWS_TRANSLATIONS = {
  fr: {
    tab: 'Actualité',
    refresh: '↻ Actualiser',
    updated: 'Mis à jour à {time}',
    updatedDay: 'Mis à jour le {date} à {time}',
    loading: 'Chargement de l’actualité…',
    offline: 'Impossible de charger l’actualité. Affichage de la dernière version enregistrée.',
    error: 'Impossible de charger l’actualité. Vérifie ta connexion puis réessaie.',
    pending: 'Pas encore d’actualité : le robot n’a pas encore fait son premier passage (il tourne toutes les heures).',
    previousDay: 'Jour précédent',
    nextDay: 'Jour suivant',
    today: 'Aujourd’hui',
    yesterday: 'Hier',
    all: 'Tout',
    themes: { monde: 'International', france: 'France', juridique: 'Justice & droit' },
    briefingTitle: 'L’essentiel',
    slots: { matin: 'Matin', soir: 'Soir' },
    briefingAt: '{slot} · {time}',
    briefingNone: 'Pas encore de briefing pour ce jour. Il est rédigé vers 7 h et vers 19 h.',
    briefingEmptyTheme: 'Rien de marquant sur la période.',
    briefingErrorTheme: 'Résumé indisponible cette fois-ci.',
    briefingAuto: 'IA indisponible : voici les sujets les plus repris par les médias.',
    briefingNote: 'Résumé rédigé par IA à partir des titres et chapôs des articles. En cas de doute, ouvre la source.',
    context: 'Pour comprendre',
    headlinesTitle: 'Tous les titres',
    headlinesCount: '{count} articles',
    headlinesEmpty: 'Aucun article pour ce jour.',
    showMore: 'Afficher plus ({count})',
    isNew: 'Nouveau',
    sources: 'Sources : {list}',
    modeDay: 'Jour',
    modeWeek: 'Semaine',
    modeAria: 'Affichage',
    weekLabel: 'Semaine du {from} au {to}',
    previousWeek: 'Semaine précédente',
    nextWeek: 'Semaine suivante',
    weekTitle: 'L’essentiel de la semaine',
    weekUpdated: 'Mis à jour le {date} à {time}',
    weekNone: 'Pas encore de résumé pour cette semaine. Il est rédigé chaque soir.',
    weekNote: 'Les faits les plus importants de la semaine, résumés par IA à partir des briefings de chaque jour. En cas de doute, ouvre la source.',
    fromOtherSlot: 'Résumé du {slot}',
    generate: '✨ Générer le résumé',
    generating: 'Résumé demandé au robot : il arrive d’ici 2 à 5 minutes…',
    generated: 'Nouveau résumé arrivé.',
    generateSlow: 'Le robot n’a pas encore publié. Réessaie « Actualiser » dans quelques minutes.',
    autoRequested: 'Le résumé du {slot} manquait : je l’ai demandé au robot, il arrive d’ici quelques minutes.',
    robotTitle: 'Lancer le robot depuis l’app',
    robotIntro: 'Le robot tourne sur GitHub. Pour le lancer d’ici en un clic, il faut un jeton GitHub à part, limité à ce dépôt (le jeton de la synchro ne peut pas le faire, et c’est voulu).',
    robotStep1: 'Ouvre la page de création de jeton (bouton ci-dessous), donne-lui un nom et une durée.',
    robotStep2: '« Repository access » : Only select repositories → MyDeskOnline.',
    robotStep3: '« Permissions » → Repository permissions → Actions : Read and write. Rien d’autre.',
    robotStep4: 'Génère le jeton, copie-le et colle-le ici. Il reste sur cet appareil.',
    robotCreate: 'Créer le jeton ↗',
    robotPlaceholder: 'github_pat_…',
    robotSave: 'Enregistrer',
    robotOnce: 'Ou, sans jeton : ouvre la page du robot sur GitHub, « Run workflow », coche « Refaire le briefing » puis « Run workflow ».',
    robotOpen: 'Ouvrir la page du robot ↗',
    robotClose: 'Fermer',
    robotForget: 'Oublier le jeton de cet appareil',
    robotRefused: 'Jeton refusé par GitHub : il doit avoir accès au dépôt MyDeskOnline avec la permission Actions (lecture et écriture).',
    robotError: 'Impossible de joindre GitHub ({message}).'
  },
  en: {
    tab: 'News',
    refresh: '↻ Refresh',
    updated: 'Updated at {time}',
    updatedDay: 'Updated on {date} at {time}',
    loading: 'Loading the news…',
    offline: 'Could not load the news. Showing the last saved version.',
    error: 'Could not load the news. Check your connection and try again.',
    pending: 'No news yet: the robot has not run for the first time (it runs every hour).',
    previousDay: 'Previous day',
    nextDay: 'Next day',
    today: 'Today',
    yesterday: 'Yesterday',
    all: 'All',
    themes: { monde: 'World', france: 'France', juridique: 'Justice & law' },
    briefingTitle: 'Key points',
    slots: { matin: 'Morning', soir: 'Evening' },
    briefingAt: '{slot} · {time}',
    briefingNone: 'No briefing for this day yet. It is written around 7 am and 7 pm (Paris time).',
    briefingEmptyTheme: 'Nothing major over this period.',
    briefingErrorTheme: 'Summary unavailable this time.',
    briefingAuto: 'AI unavailable: here are the stories most covered by the media.',
    briefingNote: 'AI-written summary (in French) based on article headlines and leads. When in doubt, open the source.',
    context: 'Background',
    headlinesTitle: 'All headlines',
    headlinesCount: '{count} articles',
    headlinesEmpty: 'No articles for this day.',
    showMore: 'Show more ({count})',
    isNew: 'New',
    sources: 'Sources: {list}',
    modeDay: 'Day',
    modeWeek: 'Week',
    modeAria: 'View',
    weekLabel: 'Week of {from} to {to}',
    previousWeek: 'Previous week',
    nextWeek: 'Next week',
    weekTitle: 'Week in review',
    weekUpdated: 'Updated on {date} at {time}',
    weekNone: 'No summary for this week yet. It is written every evening.',
    weekNote: 'The most important stories of the week, summarised by AI (in French) from the daily briefings. When in doubt, open the source.',
    fromOtherSlot: '{slot} summary',
    generate: '✨ Generate summary',
    generating: 'Summary requested from the bot: it should arrive within 2 to 5 minutes…',
    generated: 'New summary arrived.',
    generateSlow: 'The bot has not published yet. Try “Refresh” again in a few minutes.',
    autoRequested: 'The {slot} summary was missing: I asked the bot for it, it should arrive within a few minutes.',
    robotTitle: 'Run the bot from the app',
    robotIntro: 'The bot runs on GitHub. To start it from here in one click you need a separate GitHub token limited to this repository (the sync token cannot do it, on purpose).',
    robotStep1: 'Open the token page (button below), give it a name and an expiry.',
    robotStep2: '“Repository access”: Only select repositories → MyDeskOnline.',
    robotStep3: '“Permissions” → Repository permissions → Actions: Read and write. Nothing else.',
    robotStep4: 'Generate the token, copy it and paste it here. It stays on this device.',
    robotCreate: 'Create the token ↗',
    robotPlaceholder: 'github_pat_…',
    robotSave: 'Save',
    robotOnce: 'Or, without a token: open the bot page on GitHub, “Run workflow”, tick “Refaire le briefing” then “Run workflow”.',
    robotOpen: 'Open the bot page ↗',
    robotClose: 'Close',
    robotForget: 'Forget the token on this device',
    robotRefused: 'GitHub refused the token: it needs access to the MyDeskOnline repository with the Actions permission (read and write).',
    robotError: 'Cannot reach GitHub ({message}).'
  },
  vi: {
    tab: 'Tin tức',
    refresh: '↻ Làm mới',
    updated: 'Cập nhật lúc {time}',
    updatedDay: 'Cập nhật ngày {date} lúc {time}',
    loading: 'Đang tải tin tức…',
    offline: 'Không tải được tin tức. Đang hiển thị bản đã lưu gần nhất.',
    error: 'Không tải được tin tức. Kiểm tra kết nối rồi thử lại.',
    pending: 'Chưa có tin tức: robot chưa chạy lần đầu (robot chạy mỗi giờ).',
    previousDay: 'Ngày trước',
    nextDay: 'Ngày sau',
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    all: 'Tất cả',
    themes: { monde: 'Quốc tế', france: 'Pháp', juridique: 'Tư pháp & luật' },
    briefingTitle: 'Điểm chính',
    slots: { matin: 'Sáng', soir: 'Tối' },
    briefingAt: '{slot} · {time}',
    briefingNone: 'Chưa có bản tóm tắt cho ngày này. Bản tóm tắt được viết khoảng 7 giờ và 19 giờ (giờ Paris).',
    briefingEmptyTheme: 'Không có gì nổi bật trong khoảng thời gian này.',
    briefingErrorTheme: 'Lần này không có bản tóm tắt.',
    briefingAuto: 'AI không khả dụng: đây là các chủ đề được báo chí đưa tin nhiều nhất.',
    briefingNote: 'Bản tóm tắt do AI viết (bằng tiếng Pháp) từ tiêu đề và phần mở đầu bài báo. Nếu nghi ngờ, hãy mở nguồn.',
    context: 'Bối cảnh',
    headlinesTitle: 'Tất cả tiêu đề',
    headlinesCount: '{count} bài',
    headlinesEmpty: 'Không có bài nào cho ngày này.',
    showMore: 'Xem thêm ({count})',
    isNew: 'Mới',
    sources: 'Nguồn: {list}',
    modeDay: 'Ngày',
    modeWeek: 'Tuần',
    modeAria: 'Chế độ xem',
    weekLabel: 'Tuần từ {from} đến {to}',
    previousWeek: 'Tuần trước',
    nextWeek: 'Tuần sau',
    weekTitle: 'Điểm chính trong tuần',
    weekUpdated: 'Cập nhật ngày {date} lúc {time}',
    weekNone: 'Chưa có bản tóm tắt cho tuần này. Bản tóm tắt được viết mỗi tối.',
    weekNote: 'Những sự kiện quan trọng nhất trong tuần, do AI tóm tắt (bằng tiếng Pháp) từ các bản tin hằng ngày. Nếu nghi ngờ, hãy mở nguồn.',
    fromOtherSlot: 'Bản tóm tắt {slot}',
    generate: '✨ Tạo bản tóm tắt',
    generating: 'Đã yêu cầu robot: bản tóm tắt sẽ có trong 2 đến 5 phút…',
    generated: 'Đã có bản tóm tắt mới.',
    generateSlow: 'Robot chưa xuất bản. Hãy bấm “Làm mới” lại sau vài phút.',
    autoRequested: 'Thiếu bản tóm tắt {slot}: đã yêu cầu robot, sẽ có trong vài phút.',
    robotTitle: 'Chạy robot từ ứng dụng',
    robotIntro: 'Robot chạy trên GitHub. Để chạy từ đây chỉ với một cú nhấp, cần một token GitHub riêng, chỉ cho kho này.',
    robotStep1: 'Mở trang tạo token (nút bên dưới), đặt tên và thời hạn.',
    robotStep2: '“Repository access”: Only select repositories → MyDeskOnline.',
    robotStep3: '“Permissions” → Repository permissions → Actions: Read and write. Không gì khác.',
    robotStep4: 'Tạo token, sao chép và dán vào đây. Token chỉ lưu trên thiết bị này.',
    robotCreate: 'Tạo token ↗',
    robotPlaceholder: 'github_pat_…',
    robotSave: 'Lưu',
    robotOnce: 'Hoặc không cần token: mở trang robot trên GitHub, “Run workflow”, đánh dấu “Refaire le briefing” rồi “Run workflow”.',
    robotOpen: 'Mở trang robot ↗',
    robotClose: 'Đóng',
    robotForget: 'Quên token trên thiết bị này',
    robotRefused: 'GitHub từ chối token: token cần quyền truy cập kho MyDeskOnline với quyền Actions (đọc và ghi).',
    robotError: 'Không thể kết nối GitHub ({message}).'
  }
};

function registerNewsTranslations() {
  Object.keys(translations).forEach((language) => {
    const source = NEWS_TRANSLATIONS[language] || NEWS_TRANSLATIONS.fr;
    translations[language].news = source;
    if (translations[language].tabs) translations[language].tabs.news = source.tab;
  });
}

const newsState = {
  index: null,
  days: {}, // date → contenu du jour
  date: null, // jour affiché
  slot: null, // briefing affiché (matin / soir)
  theme: 'all',
  mode: 'day', // day | week
  week: null, // lundi de la semaine affichée
  weeks: {}, // lundi → résumé de la semaine
  status: 'idle', // idle | loading | ok | offline | error | pending
  loadedAt: 0,
  headlinesShown: NEWS_HEADLINES_STEP,
  seenBefore: 0, // dernière visite : les articles plus récents sont « nouveaux »
  timer: null,
  robotPanel: false, // explications pour lancer le robot depuis l'app
  robotMessage: '', // retour du bouton « Générer le résumé »
  robotError: false,
  polling: null
};

/* ── Stockage local ────────────────────────────────────────── */

function newsReadLocal(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function newsWriteLocal(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // stockage plein ou indisponible : pas grave, ce n'est qu'un cache
  }
}

function newsSaveCache() {
  if (!newsState.index) return;
  const latest = newsState.index.days[0];
  const day = latest && newsState.days[latest];
  const latestWeek = newsWeekList()[0];
  const week = latestWeek && newsState.weeks[latestWeek];
  newsWriteLocal(NEWS_CACHE_KEY, JSON.stringify({ index: newsState.index, day: day || null, week: week || null }));
}

function newsLoadCache() {
  const raw = newsReadLocal(NEWS_CACHE_KEY);
  if (!raw) return false;
  try {
    const cache = JSON.parse(raw);
    if (!cache || !cache.index || !Array.isArray(cache.index.days)) return false;
    newsState.index = cache.index;
    if (cache.day && cache.day.date) newsState.days[cache.day.date] = cache.day;
    if (cache.week && cache.week.week) newsState.weeks[cache.week.week] = cache.week;
    return true;
  } catch (error) {
    return false;
  }
}

/* ── Lancer le robot ───────────────────────────────────────── */

function newsRobotToken() {
  return (newsReadLocal(NEWS_ROBOT_TOKEN_KEY) || '').trim();
}

// Jour (AAAA-MM-JJ) et heure à Paris, comme le robot.
function newsParisNow() {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value])
  );
  return { day: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour), minute: Number(parts.minute) };
}

// Créneau en cours (matin dès 6 h, soir dès 18 h) dont le résumé IA manque
// depuis au moins NEWS_AUTO_DELAY_MS ; null sinon.
function newsMissingSlot() {
  const now = newsParisNow();
  const slot = now.hour >= NEWS_SLOT_HOURS.soir ? 'soir' : now.hour >= NEWS_SLOT_HOURS.matin ? 'matin' : null;
  if (!slot) return null;
  const minutesOpen = (now.hour - NEWS_SLOT_HOURS[slot]) * 60 + now.minute;
  if (minutesOpen * 60000 < NEWS_AUTO_DELAY_MS) return null;
  const day = newsState.days[now.day];
  if (newsState.index && newsState.index.days.includes(now.day) && !day) return null; // jour pas encore chargé
  const done = day && (day.briefings || []).some((briefing) => briefing.slot === slot && !briefing.fallback);
  return done ? null : slot;
}

async function newsDispatch() {
  const token = newsRobotToken();
  const response = await fetch(NEWS_REPO_API, {
    method: 'POST',
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ref: 'main', inputs: { briefing: 'true' } })
  });
  if (response.status === 204) return;
  const error = new Error(`HTTP ${response.status}`);
  error.status = response.status;
  throw error;
}

// Après une demande : relit l'actualité toutes les 30 s jusqu'à voir passer
// le robot (index.updatedAt plus récent que la demande).
function newsPollAfterRequest(requestedAt) {
  clearInterval(newsState.polling);
  const started = Date.now();
  newsState.polling = setInterval(async () => {
    if (newsState.status !== 'loading') await newsRefresh();
    const updated = newsState.index && Date.parse(newsState.index.updatedAt);
    if (updated && updated > requestedAt) {
      clearInterval(newsState.polling);
      newsState.polling = null;
      newsState.robotMessage = t('news.generated');
      renderNews();
    } else if (Date.now() - started > NEWS_POLL_MAX_MS) {
      clearInterval(newsState.polling);
      newsState.polling = null;
      newsState.robotMessage = t('news.generateSlow');
      renderNews();
    }
  }, NEWS_POLL_MS);
}

async function newsGenerate(auto = false, slot = null) {
  if (!newsRobotToken()) {
    newsState.robotPanel = true;
    renderNews();
    return;
  }
  const requestedAt = Date.now() - 60000; // marge : horloges et passage en cours
  try {
    await newsDispatch();
    newsWriteLocal(NEWS_AUTO_KEY, String(Date.now()));
    newsState.robotError = false;
    newsState.robotMessage = auto ? t('news.autoRequested', { slot: t(`news.slots.${slot}`).toLowerCase() }) : t('news.generating');
    newsPollAfterRequest(requestedAt);
  } catch (error) {
    newsState.robotError = true;
    newsState.robotMessage = [401, 403, 404, 422].includes(error.status)
      ? t('news.robotRefused')
      : t('news.robotError', { message: error.message });
    if (!auto) newsState.robotPanel = [401, 403, 404].includes(error.status);
  }
  renderNews();
}

// Résumé du créneau manquant à l'ouverture de l'onglet : demandé tout seul
// (si un jeton est enregistré), au plus une fois toutes les 45 min.
function newsAutoCatchUp() {
  if (!newsRobotToken() || newsState.polling || newsState.mode !== 'day') return;
  const slot = newsMissingSlot();
  if (!slot) return;
  const last = Number(newsReadLocal(NEWS_AUTO_KEY)) || 0;
  if (Date.now() - last < NEWS_AUTO_GAP_MS) return;
  newsGenerate(true, slot);
}

function renderNewsRobotPanel(container) {
  if (!newsState.robotPanel) return;
  const panel = newsEl('div', 'news-robot');
  panel.append(newsEl('h3', 'news-robot__title', t('news.robotTitle')), newsEl('p', '', t('news.robotIntro')));
  const steps = newsEl('ol', 'news-robot__steps');
  ['robotStep1', 'robotStep2', 'robotStep3', 'robotStep4'].forEach((key) => steps.append(newsEl('li', '', t(`news.${key}`))));
  panel.append(steps);
  const form = newsEl('form', 'news-robot__form');
  const create = newsLink(NEWS_TOKEN_PAGE, t('news.robotCreate'), 'btn-secondary news-robot__link');
  const input = newsEl('input', 'news-robot__input');
  input.type = 'password';
  input.autocomplete = 'off';
  input.placeholder = t('news.robotPlaceholder');
  input.setAttribute('aria-label', t('news.robotPlaceholder'));
  const save = newsEl('button', 'news-robot__save', t('news.robotSave'));
  save.type = 'submit';
  form.append(create, input, save);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    newsWriteLocal(NEWS_ROBOT_TOKEN_KEY, value);
    newsState.robotPanel = false;
    newsGenerate();
  });
  panel.append(form);
  const once = newsEl('p', 'news-robot__once', t('news.robotOnce'));
  once.append(' ', newsLink(NEWS_ACTIONS_PAGE, t('news.robotOpen')));
  panel.append(once);
  const actions = newsEl('div', 'news-robot__actions');
  if (newsRobotToken()) {
    const forget = newsEl('button', 'btn-secondary', t('news.robotForget'));
    forget.type = 'button';
    forget.addEventListener('click', () => {
      try {
        localStorage.removeItem(NEWS_ROBOT_TOKEN_KEY);
      } catch (error) {
        // ignoré
      }
      newsState.robotMessage = '';
      renderNews();
    });
    actions.append(forget);
  }
  const close = newsEl('button', 'btn-secondary', t('news.robotClose'));
  close.type = 'button';
  close.addEventListener('click', () => {
    newsState.robotPanel = false;
    renderNews();
  });
  actions.append(close);
  panel.append(actions);
  container.append(panel);
}

/* ── Chargement ────────────────────────────────────────────── */

async function newsFetchJson(file) {
  // Le CDN de GitHub garde les fichiers ~5 min : le paramètre évite d'attendre davantage.
  const stamp = Math.floor(Date.now() / 60000);
  const response = await fetch(`${NEWS_DATA_URL}${file}?t=${stamp}`, { cache: 'no-store' });
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function newsLoadDay(date) {
  if (newsState.days[date] && newsState.days[date].fresh) return newsState.days[date];
  const day = await newsFetchJson(`days/${date}.json`);
  day.fresh = true;
  newsState.days[date] = day;
  return day;
}

async function newsLoadWeek(monday) {
  if (newsState.weeks[monday] && newsState.weeks[monday].fresh) return newsState.weeks[monday];
  const week = await newsFetchJson(`weeks/${monday}.json`);
  week.fresh = true;
  newsState.weeks[monday] = week;
  return week;
}

function newsWeekList() {
  return newsState.index && Array.isArray(newsState.index.weeks) ? newsState.index.weeks : [];
}

async function newsRefresh() {
  if (newsState.status === 'loading') return;
  newsState.status = 'loading';
  renderNews();
  try {
    const index = await newsFetchJson('index.json');
    if (!index || !Array.isArray(index.days)) throw new Error('index invalide');
    const changed = !newsState.index || newsState.index.updatedAt !== index.updatedAt;
    newsState.index = index;
    if (changed) {
      Object.values(newsState.days).forEach((day) => {
        day.fresh = false;
      });
      Object.values(newsState.weeks).forEach((week) => {
        week.fresh = false;
      });
    }
    if (!newsState.date || !index.days.includes(newsState.date)) newsState.date = index.days[0] || null;
    const weeks = newsWeekList();
    if (!newsState.week || !weeks.includes(newsState.week)) newsState.week = weeks[0] || null;
    if (newsState.mode === 'week') {
      if (newsState.week) await newsLoadWeek(newsState.week);
    } else if (newsState.date) {
      await newsLoadDay(newsState.date);
    }
    newsState.status = 'ok';
    newsState.loadedAt = Date.now();
    newsSaveCache();
    setTimeout(newsAutoCatchUp, 0);
  } catch (error) {
    console.warn('Actualité indisponible', error);
    // 404 sur index.json : la branche « news » n'existe pas encore.
    if (newsState.index) newsState.status = 'offline';
    else newsState.status = error.status === 404 ? 'pending' : 'error';
  }
  renderNews();
}

async function newsShowDay(date) {
  newsState.date = date;
  newsState.slot = null;
  newsState.headlinesShown = NEWS_HEADLINES_STEP;
  if (!newsState.days[date] || !newsState.days[date].fresh) {
    newsState.status = 'loading';
    renderNews();
    try {
      await newsLoadDay(date);
      newsState.status = 'ok';
    } catch (error) {
      newsState.status = newsState.days[date] ? 'offline' : 'error';
    }
  }
  renderNews();
}

async function newsShowWeek(monday) {
  newsState.week = monday;
  if (monday && (!newsState.weeks[monday] || !newsState.weeks[monday].fresh)) {
    newsState.status = 'loading';
    renderNews();
    try {
      await newsLoadWeek(monday);
      newsState.status = 'ok';
    } catch (error) {
      newsState.status = newsState.weeks[monday] ? 'offline' : error.status === 404 ? 'ok' : 'error';
    }
  }
  renderNews();
}

function newsSetMode(mode) {
  newsState.mode = mode;
  newsWriteLocal(NEWS_MODE_KEY, mode);
  if (mode === 'week') newsShowWeek(newsState.week || newsWeekList()[0] || null);
  else if (newsState.date) newsShowDay(newsState.date);
  else renderNews();
}

/* ── Affichage ─────────────────────────────────────────────── */

function newsEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function newsLink(href, text, className) {
  const link = newsEl('a', className, text);
  // Seuls les liens web sont acceptés (les données viennent de flux externes).
  if (/^https?:\/\//i.test(href || '')) {
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  return link;
}

function newsDayLabel(date) {
  const today = new Date();
  const iso = (value) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const [year, month, day] = date.split('-').map(Number);
  const label = new Date(year, month - 1, day).toLocaleDateString(getCurrentLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  if (date === iso(today)) return `${t('news.today')} · ${label}`;
  if (date === iso(yesterday)) return `${t('news.yesterday')} · ${label}`;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function newsWeekLabel(monday) {
  const [year, month, day] = monday.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  const end = new Date(year, month - 1, day + 6);
  const format = (date) => date.toLocaleDateString(getCurrentLocale(), { day: 'numeric', month: 'short' });
  return t('news.weekLabel', { from: format(start), to: format(end) });
}

function newsThemeLabel(theme) {
  const label = t(`news.themes.${theme}`);
  return label === `news.themes.${theme}` ? theme : label;
}

function renderNewsToolbar(container) {
  const bar = newsEl('div', 'news-toolbar');
  const weekMode = newsState.mode === 'week';
  const list = weekMode ? newsWeekList() : newsState.index ? newsState.index.days : [];
  const currentKey = weekMode ? newsState.week : newsState.date;
  const position = list.indexOf(currentKey);
  const show = (key) => (weekMode ? newsShowWeek(key) : newsShowDay(key));

  const group = newsEl('div', 'news-toolbar__nav');
  const nav = newsEl('div', 'news-daynav');
  const previous = newsEl('button', 'news-daynav__btn', '‹');
  previous.type = 'button';
  previous.title = t(weekMode ? 'news.previousWeek' : 'news.previousDay');
  previous.setAttribute('aria-label', previous.title);
  previous.disabled = position < 0 || position >= list.length - 1;
  previous.addEventListener('click', () => show(list[position + 1]));
  const next = newsEl('button', 'news-daynav__btn', '›');
  next.type = 'button';
  next.title = t(weekMode ? 'news.nextWeek' : 'news.nextDay');
  next.setAttribute('aria-label', next.title);
  next.disabled = position <= 0;
  next.addEventListener('click', () => show(list[position - 1]));
  let labelText = t('news.tab');
  if (weekMode && newsState.week) labelText = newsWeekLabel(newsState.week);
  if (!weekMode && newsState.date) labelText = newsDayLabel(newsState.date);
  const label = newsEl('h2', 'news-daynav__label', labelText);
  nav.append(previous, label, next);

  // Bascule Jour / Semaine, juste à droite de la sélection.
  const modes = newsEl('div', 'news-modes');
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', t('news.modeAria'));
  ['day', 'week'].forEach((mode) => {
    const button = newsEl('button', 'news-mode', t(mode === 'day' ? 'news.modeDay' : 'news.modeWeek'));
    button.type = 'button';
    button.classList.toggle('is-active', newsState.mode === mode);
    button.setAttribute('aria-pressed', newsState.mode === mode ? 'true' : 'false');
    button.addEventListener('click', () => {
      if (newsState.mode !== mode) newsSetMode(mode);
    });
    modes.append(button);
  });
  group.append(nav, modes);

  const meta = newsEl('div', 'news-toolbar__meta');
  if (newsState.index && newsState.index.updatedAt) {
    const updated = new Date(newsState.index.updatedAt);
    const sameDay = updated.toDateString() === new Date().toDateString();
    meta.append(
      newsEl(
        'span',
        'news-toolbar__updated',
        sameDay
          ? t('news.updated', { time: formatTime(updated) })
          : t('news.updatedDay', { date: updated.toLocaleDateString(getCurrentLocale()), time: formatTime(updated) })
      )
    );
  }
  const refresh = newsEl('button', 'btn-secondary news-toolbar__refresh', t('news.refresh'));
  refresh.type = 'button';
  refresh.disabled = newsState.status === 'loading';
  refresh.addEventListener('click', () => newsRefresh());
  const generate = newsEl('button', 'news-toolbar__generate', t('news.generate'));
  generate.type = 'button';
  generate.disabled = Boolean(newsState.polling);
  generate.addEventListener('click', () => newsGenerate());
  meta.append(generate, refresh);

  bar.append(group, meta);
  container.append(bar);

  const filters = newsEl('div', 'news-filters');
  filters.setAttribute('role', 'tablist');
  ['all', ...NEWS_THEME_ORDER].forEach((theme) => {
    const chip = newsEl('button', `news-chip news-chip--${theme}`, theme === 'all' ? t('news.all') : newsThemeLabel(theme));
    chip.type = 'button';
    chip.setAttribute('role', 'tab');
    chip.setAttribute('aria-selected', newsState.theme === theme ? 'true' : 'false');
    chip.classList.toggle('is-active', newsState.theme === theme);
    chip.addEventListener('click', () => {
      newsState.theme = theme;
      newsState.headlinesShown = NEWS_HEADLINES_STEP;
      newsWriteLocal(NEWS_THEME_KEY, theme);
      renderNews();
    });
    filters.append(chip);
  });
  container.append(filters);
}

function renderNewsPoints(block, data) {
  if (data.auto) block.append(newsEl('p', 'news-auto', t('news.briefingAuto')));
  const points = Array.isArray(data.points) ? data.points : [];
  if (!points.length) {
    block.append(newsEl('p', 'news-empty', data.error ? t('news.briefingErrorTheme') : t('news.briefingEmptyTheme')));
    return;
  }
  const list = newsEl('ol', 'news-points');
  points.forEach((point) => {
    const item = newsEl('li', 'news-point');
    const title = newsEl('p', 'news-point__title', point.title);
    if (point.dates) title.prepend(newsEl('span', 'news-point__dates', point.dates));
    item.append(title);
    item.append(newsEl('p', 'news-point__summary', point.summary));
    if (point.context) {
      const context = newsEl('p', 'news-point__context');
      context.append(newsEl('strong', null, `${t('news.context')} : `), document.createTextNode(point.context));
      item.append(context);
    }
    if (Array.isArray(point.sources) && point.sources.length) {
      const sources = newsEl('p', 'news-point__sources');
      point.sources.forEach((source, index) => {
        if (index) sources.append(document.createTextNode(' · '));
        const link = newsLink(source.link, source.source, 'news-point__source');
        link.title = source.title || '';
        sources.append(link);
      });
      item.append(sources);
    }
    list.append(item);
  });
  block.append(list);
}

function renderNewsBriefing(container, day) {
  const section = newsEl('section', 'news-briefing');
  const head = newsEl('div', 'news-section__head');
  head.append(newsEl('h3', 'news-section__title', t('news.briefingTitle')));

  const briefings = (day && Array.isArray(day.briefings) ? day.briefings : [])
    .slice()
    .sort((a, b) => Date.parse(b.generatedAt) - Date.parse(a.generatedAt));
  if (!briefings.length) {
    section.append(head, newsEl('p', 'news-empty', t('news.briefingNone')));
    container.append(section);
    return;
  }
  const current = briefings.find((briefing) => briefing.slot === newsState.slot) || briefings[0];
  if (briefings.length > 1) {
    const switcher = newsEl('div', 'news-slots');
    briefings
      .slice()
      .reverse()
      .forEach((briefing) => {
        const button = newsEl(
          'button',
          'news-slot',
          t('news.briefingAt', { slot: t(`news.slots.${briefing.slot}`), time: formatTime(new Date(briefing.generatedAt)) })
        );
        button.type = 'button';
        button.classList.toggle('is-active', briefing === current);
        button.setAttribute('aria-pressed', briefing === current ? 'true' : 'false');
        button.addEventListener('click', () => {
          newsState.slot = briefing.slot;
          renderNews();
        });
        switcher.append(button);
      });
    head.append(switcher);
  } else {
    head.append(
      newsEl(
        'span',
        'news-section__meta',
        t('news.briefingAt', { slot: t(`news.slots.${current.slot}`), time: formatTime(new Date(current.generatedAt)) })
      )
    );
  }
  section.append(head);

  // Un thème absent de ce briefing (ex. Justice, rédigé une fois par jour)
  // est repris d'un autre briefing du même jour.
  NEWS_THEME_ORDER.filter((theme) => newsState.theme === 'all' || newsState.theme === theme).forEach((theme) => {
    let data = current.themes && current.themes[theme];
    let origin = null;
    if (!data) {
      origin = briefings.find((briefing) => briefing !== current && briefing.themes && briefing.themes[theme]);
      data = origin ? origin.themes[theme] : null;
    }
    if (!data) return;
    const block = newsEl('div', `news-theme news-theme--${theme}`);
    const title = newsEl('h4', 'news-theme__title', newsThemeLabel(theme));
    if (origin) {
      title.append(
        newsEl('span', 'news-theme__origin', t('news.fromOtherSlot', { slot: t(`news.slots.${origin.slot}`).toLowerCase() }))
      );
    }
    block.append(title);
    renderNewsPoints(block, data);
    section.append(block);
  });
  section.append(newsEl('p', 'news-note', t('news.briefingNote')));
  container.append(section);
}

function renderNewsWeek(container, week) {
  const section = newsEl('section', 'news-briefing news-week');
  const head = newsEl('div', 'news-section__head');
  head.append(newsEl('h3', 'news-section__title', t('news.weekTitle')));
  if (week && week.generatedAt) {
    const updated = new Date(week.generatedAt);
    head.append(
      newsEl(
        'span',
        'news-section__meta',
        t('news.weekUpdated', { date: updated.toLocaleDateString(getCurrentLocale()), time: formatTime(updated) })
      )
    );
  }
  section.append(head);
  if (!week || !week.themes) {
    section.append(newsEl('p', 'news-empty', t('news.weekNone')));
    container.append(section);
    return;
  }
  NEWS_THEME_ORDER.filter((theme) => week.themes[theme])
    .filter((theme) => newsState.theme === 'all' || newsState.theme === theme)
    .forEach((theme) => {
      const block = newsEl('div', `news-theme news-theme--${theme}`);
      block.append(newsEl('h4', 'news-theme__title', newsThemeLabel(theme)));
      renderNewsPoints(block, week.themes[theme]);
      section.append(block);
    });
  section.append(newsEl('p', 'news-note', t('news.weekNote')));
  container.append(section);
}

function renderNewsHeadlines(container, day) {
  const section = newsEl('section', 'news-headlines');
  const items = (day && Array.isArray(day.items) ? day.items : []).filter(
    (item) => newsState.theme === 'all' || item.theme === newsState.theme
  );
  const head = newsEl('div', 'news-section__head');
  head.append(newsEl('h3', 'news-section__title', t('news.headlinesTitle')));
  head.append(newsEl('span', 'news-section__meta', t('news.headlinesCount', { count: items.length })));
  section.append(head);

  if (!items.length) {
    section.append(newsEl('p', 'news-empty', t('news.headlinesEmpty')));
    container.append(section);
    return;
  }
  const list = newsEl('ul', 'news-list');
  items.slice(0, newsState.headlinesShown).forEach((item) => {
    const row = newsEl('li', `news-item news-item--${item.theme}`);
    const meta = newsEl('div', 'news-item__meta');
    const date = new Date(item.date);
    meta.append(newsEl('span', 'news-item__time', formatTime(date)));
    meta.append(newsEl('span', 'news-item__source', item.source));
    if (newsState.theme === 'all') meta.append(newsEl('span', 'news-item__theme', newsThemeLabel(item.theme)));
    if (newsState.seenBefore && date.getTime() > newsState.seenBefore) {
      meta.append(newsEl('span', 'news-item__new', t('news.isNew')));
    }
    row.append(meta);
    row.append(newsLink(item.link, item.title, 'news-item__title'));
    if (item.summary) {
      const summary = newsEl('p', 'news-item__summary', item.summary);
      summary.addEventListener('click', () => summary.classList.toggle('is-open'));
      row.append(summary);
    }
    list.append(row);
  });
  section.append(list);
  const hidden = items.length - newsState.headlinesShown;
  if (hidden > 0) {
    const more = newsEl('button', 'btn-secondary news-more', t('news.showMore', { count: hidden }));
    more.type = 'button';
    more.addEventListener('click', () => {
      newsState.headlinesShown += NEWS_HEADLINES_STEP;
      renderNews();
    });
    section.append(more);
  }
  container.append(section);
}

function renderNews() {
  const container = document.getElementById('news-app');
  if (!container) return;
  container.innerHTML = '';
  renderNewsToolbar(container);
  renderNewsRobotPanel(container);
  if (newsState.robotMessage) {
    const robot = newsEl('p', 'news-robot__message', newsState.robotMessage);
    robot.classList.toggle('is-error', newsState.robotError);
    container.append(robot);
  }

  const message = newsEl('p', 'news-status');
  message.setAttribute('aria-live', 'polite');
  if (newsState.status === 'loading' && !newsState.index) message.textContent = t('news.loading');
  if (newsState.status === 'offline') message.textContent = t('news.offline');
  if (newsState.status === 'error') message.textContent = t('news.error');
  if (newsState.status === 'pending') message.textContent = t('news.pending');
  message.classList.toggle('is-error', newsState.status === 'error' || newsState.status === 'offline');
  container.append(message);

  if (newsState.mode === 'week') {
    if (!newsState.index) return;
    const weekLayout = newsEl('div', 'news-layout news-layout--week');
    renderNewsWeek(weekLayout, newsState.week ? newsState.weeks[newsState.week] : null);
    container.append(weekLayout);
    return;
  }

  const day = newsState.date ? newsState.days[newsState.date] : null;
  if (!day) return;
  const layout = newsEl('div', 'news-layout');
  renderNewsBriefing(layout, day);
  renderNewsHeadlines(layout, day);
  container.append(layout);
}

/* ── Cycle de vie ──────────────────────────────────────────── */

function newsTabIsActive() {
  const panel = document.getElementById('news');
  return Boolean(panel && panel.classList.contains('active'));
}

function newsOnShow() {
  if (!newsState.seenBefore) {
    newsState.seenBefore = Number(newsReadLocal(NEWS_SEEN_KEY)) || 0;
  }
  renderNews();
  if (Date.now() - newsState.loadedAt > NEWS_REFRESH_MS) newsRefresh();
  // On retient la visite : les articles de maintenant ne seront plus
  // « nouveaux » la prochaine fois.
  newsWriteLocal(NEWS_SEEN_KEY, String(Date.now()));
}

function initNews() {
  const panel = document.getElementById('news');
  if (!panel) return;
  const savedTheme = newsReadLocal(NEWS_THEME_KEY);
  if (savedTheme && (savedTheme === 'all' || NEWS_THEME_ORDER.includes(savedTheme))) newsState.theme = savedTheme;
  if (newsReadLocal(NEWS_MODE_KEY) === 'week') newsState.mode = 'week';
  if (newsLoadCache()) {
    newsState.date = newsState.index.days[0] || null;
    newsState.week = newsWeekList()[0] || null;
  }

  // L'onglet est ouvert/fermé par script.js (classe « active ») : on observe.
  let wasActive = false;
  const check = () => {
    const active = newsTabIsActive();
    if (active && !wasActive) newsOnShow();
    wasActive = active;
  };
  new MutationObserver(check).observe(panel, { attributes: true, attributeFilter: ['class'] });
  check();

  newsState.timer = setInterval(() => {
    if (newsTabIsActive() && document.visibilityState === 'visible') newsRefresh();
  }, NEWS_REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && newsTabIsActive() && Date.now() - newsState.loadedAt > NEWS_REFRESH_MS) {
      newsRefresh();
    }
  });
}
