/* ═══════════════════════════════════════════════════════════
   ONGLET ACTUALITÉ
   Lit les fichiers publiés par le robot (.github/news-bot) dans la
   branche « news » du dépôt :
     index.json            jours disponibles, heure de mise à jour
     days/AAAA-MM-JJ.json  articles (titre, chapô, lien) et briefings
   Le briefing est rédigé par IA à partir des titres et chapôs ; les
   articles renvoient vers le site de la source.
   Rien n'est synchronisé : seul un cache local (dernier jour lu, heure
   de dernière visite) est gardé sur l'appareil.
   ═══════════════════════════════════════════════════════════ */

const NEWS_DATA_URL = 'https://raw.githubusercontent.com/Radvak/MyDeskOnline/news/';
const NEWS_CACHE_KEY = 'mydesk-news-cache';
const NEWS_SEEN_KEY = 'mydesk-news-seen';
const NEWS_THEME_KEY = 'mydesk-news-theme';
const NEWS_REFRESH_MS = 15 * 60 * 1000;
const NEWS_HEADLINES_STEP = 40;
const NEWS_THEME_ORDER = ['monde', 'france', 'juridique'];

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
    briefingNote: 'Résumé rédigé par IA à partir des titres et chapôs des articles. En cas de doute, ouvre la source.',
    context: 'Pour comprendre',
    headlinesTitle: 'Tous les titres',
    headlinesCount: '{count} articles',
    headlinesEmpty: 'Aucun article pour ce jour.',
    showMore: 'Afficher plus ({count})',
    isNew: 'Nouveau',
    sources: 'Sources : {list}'
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
    briefingNote: 'AI-written summary (in French) based on article headlines and leads. When in doubt, open the source.',
    context: 'Background',
    headlinesTitle: 'All headlines',
    headlinesCount: '{count} articles',
    headlinesEmpty: 'No articles for this day.',
    showMore: 'Show more ({count})',
    isNew: 'New',
    sources: 'Sources: {list}'
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
    briefingNote: 'Bản tóm tắt do AI viết (bằng tiếng Pháp) từ tiêu đề và phần mở đầu bài báo. Nếu nghi ngờ, hãy mở nguồn.',
    context: 'Bối cảnh',
    headlinesTitle: 'Tất cả tiêu đề',
    headlinesCount: '{count} bài',
    headlinesEmpty: 'Không có bài nào cho ngày này.',
    showMore: 'Xem thêm ({count})',
    isNew: 'Mới',
    sources: 'Nguồn: {list}'
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
  status: 'idle', // idle | loading | ok | offline | error | pending
  loadedAt: 0,
  headlinesShown: NEWS_HEADLINES_STEP,
  seenBefore: 0, // dernière visite : les articles plus récents sont « nouveaux »
  timer: null
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
  newsWriteLocal(NEWS_CACHE_KEY, JSON.stringify({ index: newsState.index, day: day || null }));
}

function newsLoadCache() {
  const raw = newsReadLocal(NEWS_CACHE_KEY);
  if (!raw) return false;
  try {
    const cache = JSON.parse(raw);
    if (!cache || !cache.index || !Array.isArray(cache.index.days)) return false;
    newsState.index = cache.index;
    if (cache.day && cache.day.date) newsState.days[cache.day.date] = cache.day;
    return true;
  } catch (error) {
    return false;
  }
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
    }
    if (!newsState.date || !index.days.includes(newsState.date)) newsState.date = index.days[0] || null;
    if (newsState.date) await newsLoadDay(newsState.date);
    newsState.status = 'ok';
    newsState.loadedAt = Date.now();
    newsSaveCache();
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

function newsThemeLabel(theme) {
  const label = t(`news.themes.${theme}`);
  return label === `news.themes.${theme}` ? theme : label;
}

function renderNewsToolbar(container) {
  const bar = newsEl('div', 'news-toolbar');
  const days = newsState.index ? newsState.index.days : [];
  const position = days.indexOf(newsState.date);

  const nav = newsEl('div', 'news-daynav');
  const previous = newsEl('button', 'news-daynav__btn', '‹');
  previous.type = 'button';
  previous.title = t('news.previousDay');
  previous.setAttribute('aria-label', t('news.previousDay'));
  previous.disabled = position < 0 || position >= days.length - 1;
  previous.addEventListener('click', () => newsShowDay(days[position + 1]));
  const next = newsEl('button', 'news-daynav__btn', '›');
  next.type = 'button';
  next.title = t('news.nextDay');
  next.setAttribute('aria-label', t('news.nextDay'));
  next.disabled = position <= 0;
  next.addEventListener('click', () => newsShowDay(days[position - 1]));
  const label = newsEl('h2', 'news-daynav__label', newsState.date ? newsDayLabel(newsState.date) : t('news.tab'));
  nav.append(previous, label, next);

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
  meta.append(refresh);

  bar.append(nav, meta);
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

  const themes = NEWS_THEME_ORDER.filter((theme) => current.themes && current.themes[theme]).filter(
    (theme) => newsState.theme === 'all' || newsState.theme === theme
  );
  themes.forEach((theme) => {
    const block = newsEl('div', `news-theme news-theme--${theme}`);
    block.append(newsEl('h4', 'news-theme__title', newsThemeLabel(theme)));
    const data = current.themes[theme];
    const points = Array.isArray(data.points) ? data.points : [];
    if (!points.length) {
      block.append(newsEl('p', 'news-empty', data.error ? t('news.briefingErrorTheme') : t('news.briefingEmptyTheme')));
    } else {
      const list = newsEl('ol', 'news-points');
      points.forEach((point) => {
        const item = newsEl('li', 'news-point');
        item.append(newsEl('p', 'news-point__title', point.title));
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
    section.append(block);
  });
  section.append(newsEl('p', 'news-note', t('news.briefingNote')));
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

  const message = newsEl('p', 'news-status');
  message.setAttribute('aria-live', 'polite');
  if (newsState.status === 'loading' && !newsState.index) message.textContent = t('news.loading');
  if (newsState.status === 'offline') message.textContent = t('news.offline');
  if (newsState.status === 'error') message.textContent = t('news.error');
  if (newsState.status === 'pending') message.textContent = t('news.pending');
  message.classList.toggle('is-error', newsState.status === 'error' || newsState.status === 'offline');
  container.append(message);

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
  if (newsLoadCache()) newsState.date = newsState.index.days[0] || null;

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
