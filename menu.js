/* ═══════════════════════════════════════════════════════════
   ONGLET MENU — l'outil Menu (Projet Menu) dans MyDesk, sans le PC
   - Les données publiées par le PC (publier_mydesk.py) sont dans un
     Gist privé dédié, repéré par le fichier menu-base.gz.b64.
   - Elles ne sont téléchargées que lorsqu'elles changent (version =
     dernier commit du Gist), puis gardées en cache (IndexedDB) :
     l'onglet fonctionne hors ligne.
   - L'interface est celle de l'outil (templates/index.html), affichée
     dans une iframe : ses appels fetch() vers le serveur Flask sont
     redirigés vers MenuEngine (menu-engine.js).
   ═══════════════════════════════════════════════════════════ */

const MENU_GIST_KEY = 'mydesk-menu-gist';
const MENU_FICHIER_REPERE = 'menu-base.gz.b64';
const MENU_DB = 'mydesk-menu';
const MENU_VERIF_MS = 10 * 60 * 1000;

const MENU_TRANSLATIONS = {
  fr: {
    loading: 'Chargement des menus…',
    downloading: 'Téléchargement des menus publiés par le PC…',
    noSync: "Active la synchronisation (onglet Accueil) : l'outil Menu utilise le même compte GitHub.",
    notPublished: "Aucun menu publié pour l'instant. Sur le PC, lance « Publier vers MyDesk.bat » dans le dossier Projet Menu (une seule fois : ensuite c'est automatique après chaque scraping).",
    offline: 'Hors ligne : menus du {date} (copie locale).',
    error: 'Impossible de charger les menus : {message}',
    updated: 'Menus mis à jour ({date}).',
    publishedOn: 'Données du PC publiées le {date}',
    refresh: '↻ Vérifier les mises à jour'
  },
  en: {
    loading: 'Loading menus…',
    downloading: 'Downloading the menus published by the PC…',
    noSync: 'Turn on sync (Home tab): the Menu tool uses the same GitHub account.',
    notPublished: 'No menus published yet. On the PC, run "Publier vers MyDesk.bat" in the Projet Menu folder (only once: afterwards it runs after each scraping).',
    offline: 'Offline: menus from {date} (local copy).',
    error: 'Unable to load menus: {message}',
    updated: 'Menus updated ({date}).',
    publishedOn: 'PC data published on {date}',
    refresh: '↻ Check for updates'
  },
  vi: {
    loading: 'Đang tải thực đơn…',
    downloading: 'Đang tải thực đơn từ máy tính…',
    noSync: 'Hãy bật đồng bộ (tab Trang chủ): công cụ Menu dùng cùng tài khoản GitHub.',
    notPublished: 'Chưa có thực đơn nào được xuất bản. Trên máy tính, chạy "Publier vers MyDesk.bat" trong thư mục Projet Menu.',
    offline: 'Ngoại tuyến: thực đơn ngày {date} (bản lưu cục bộ).',
    error: 'Không thể tải thực đơn: {message}',
    updated: 'Đã cập nhật thực đơn ({date}).',
    publishedOn: 'Dữ liệu máy tính xuất bản ngày {date}',
    refresh: '↻ Kiểm tra cập nhật'
  }
};
const MENU_TAB_TRANSLATIONS = { fr: 'Menu', en: 'Meals', vi: 'Thực đơn' };

let menuDonnees = null; // {version, base, catalogue, ui, etatInitial}
let menuChargement = null;
let menuDerniereVerif = 0;
let menuEtatAffiche = null; // état au moment où l'iframe l'a vu en dernier

function registerMenuTranslations() {
  Object.keys(MENU_TRANSLATIONS).forEach((language) => {
    if (!translations[language]) return;
    translations[language].menutool = MENU_TRANSLATIONS[language];
    if (translations[language].tabs) translations[language].tabs.menutool = MENU_TAB_TRANSLATIONS[language];
  });
}

/* ── Cache local (IndexedDB) ───────────────────────────────── */

function menuDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(MENU_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('cache');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function menuCacheLire() {
  try {
    const db = await menuDb();
    return await new Promise((resolve, reject) => {
      const req = db.transaction('cache', 'readonly').objectStore('cache').get('donnees');
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (error) {
    return null;
  }
}

async function menuCacheEcrire(donnees) {
  try {
    const db = await menuDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction('cache', 'readwrite');
      tx.objectStore('cache').put(donnees, 'donnees');
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('Cache Menu indisponible', error);
  }
}

/* ── GitHub ────────────────────────────────────────────────── */

async function menuApi(chemin) {
  const reponse = await fetch(`https://api.github.com${chemin}`, {
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${syncSettings.token}` },
    cache: 'no-store'
  });
  if (!reponse.ok) {
    const erreur = new Error(`GitHub ${reponse.status}`);
    erreur.status = reponse.status;
    throw erreur;
  }
  return reponse.json();
}

async function menuTrouverGist() {
  try {
    const memo = JSON.parse(localStorage.getItem(MENU_GIST_KEY) || 'null');
    if (memo && memo.id) return memo.id;
  } catch (error) {
    // ignoré
  }
  for (let page = 1; page <= 10; page += 1) {
    const gists = await menuApi(`/gists?per_page=100&page=${page}`);
    const trouve = gists.find((gist) => gist.files && gist.files[MENU_FICHIER_REPERE]);
    if (trouve) {
      try {
        localStorage.setItem(MENU_GIST_KEY, JSON.stringify({ id: trouve.id }));
      } catch (error) {
        // ignoré
      }
      return trouve.id;
    }
    if (gists.length < 100) break;
  }
  return null;
}

async function menuDezip(b64) {
  const octets = Uint8Array.from(atob(b64.trim()), (c) => c.charCodeAt(0));
  const flux = new Blob([octets]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(flux).text());
}

async function menuTexteBrut(gist, nom) {
  const fichier = gist.files[nom];
  if (!fichier) return null;
  if (!fichier.truncated && typeof fichier.content === 'string') return fichier.content;
  const reponse = await fetch(fichier.raw_url, { cache: 'no-store' });
  if (!reponse.ok) throw new Error(`${nom} : ${reponse.status}`);
  return reponse.text();
}

// Télécharge les données si le Gist a changé depuis la copie locale.
async function menuSynchroniserDonnees() {
  const gistId = await menuTrouverGist();
  if (!gistId) return { etat: 'non-publie' };
  let commits;
  try {
    commits = await menuApi(`/gists/${gistId}/commits?per_page=1`);
  } catch (error) {
    if (error.status === 404) {
      localStorage.removeItem(MENU_GIST_KEY);
      return { etat: 'non-publie' };
    }
    throw error;
  }
  const version = commits && commits[0] ? commits[0].version : null;
  if (menuDonnees && menuDonnees.version === version) return { etat: 'a-jour' };
  const cache = await menuCacheLire();
  if (cache && cache.version === version) {
    menuDonnees = cache;
    return { etat: 'charge' };
  }
  menuStatut('menutool.downloading', 'info');
  const gist = await menuApi(`/gists/${gistId}`);
  const texteBase = await menuTexteBrut(gist, 'menu-base.gz.b64');
  if (!texteBase || texteBase.startsWith('en attente')) return { etat: 'non-publie' };
  const [base, texteCatalogue, ui, texteEtat] = await Promise.all([
    menuDezip(texteBase),
    menuTexteBrut(gist, 'menu-catalogue.gz.b64'),
    menuTexteBrut(gist, 'menu-ui.html'),
    menuTexteBrut(gist, 'menu-etat-initial.json')
  ]);
  menuDonnees = {
    version,
    base,
    catalogue: texteCatalogue ? await menuDezip(texteCatalogue) : null,
    ui,
    etatInitial: texteEtat ? JSON.parse(texteEtat) : null
  };
  await menuCacheEcrire(menuDonnees);
  return { etat: 'telecharge' };
}

/* ── Interface ─────────────────────────────────────────────── */

function menuStatut(cle, type = 'info', variables = {}) {
  const status = document.getElementById('menutool-status');
  if (!status) return;
  status.textContent = cle ? t(cle, variables) : '';
  status.className = `menutool-status ${type}`;
}

function menuDateLisible(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : `${formatDate(date, { weekday: 'short' })} ${formatTime(date)}`;
}

// Script injecté dans l'iframe AVANT celui de l'outil : ses fetch() vers le
// serveur Flask sont servis par MenuEngine, dans la page parente.
const MENU_SHIM = `
<script>
(function () {
  var moteur = window.parent && window.parent.MenuEngine;
  var fetchReseau = window.fetch.bind(window);
  window.fetch = function (ressource, options) {
    var brut = typeof ressource === 'string' ? ressource : (ressource && ressource.url) || '';
    var url = new URL(brut, 'http://menu.local');
    if (url.origin !== 'http://menu.local') return fetchReseau(ressource, options);
    var methode = ((options && options.method) || 'GET').toUpperCase();
    var corps = {};
    if (options && typeof options.body === 'string') {
      try { corps = JSON.parse(options.body); } catch (e) { corps = {}; }
    }
    var reponse;
    try {
      reponse = moteur.handle(url.pathname, methode, corps, url.searchParams);
      if (methode !== 'GET' && window.parent.menuApresAction) window.parent.menuApresAction();
    } catch (e) {
      console.error(e);
      reponse = { status: 500, data: { ok: false, message: 'Erreur du moteur Menu : ' + e.message, erreur: e.message } };
    }
    return Promise.resolve(new Response(JSON.stringify(reponse.data), {
      status: reponse.status, headers: { 'Content-Type': 'application/json' }
    }));
  };
  // Le scraping reste sur le PC : on masque son onglet et on ouvre "Tous les menus".
  var style = document.createElement('style');
  // + petits écrans : sans min-width:0, le rail d'onglets (défilant) et le
  // contenu gardaient leur largeur minimale et élargissaient toute la page.
  style.textContent = '#onglet-recette{display:none!important}'
    + '@media (max-width:1000px){.app{grid-template-columns:minmax(0,1fr)}.app>*{min-width:0}.scene{padding:20px 14px 60px}}';
  document.head.appendChild(style);
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof window.afficherOnglet === 'function') window.afficherOnglet('menus');
  });
})();
<\/script>`;

function menuAfficherIframe() {
  const conteneur = document.getElementById('menutool-frame');
  if (!conteneur || !menuDonnees || !menuDonnees.ui) return;
  const html = menuDonnees.ui.includes('<head>')
    ? menuDonnees.ui.replace('<head>', `<head>${MENU_SHIM}`)
    : MENU_SHIM + menuDonnees.ui;
  let iframe = conteneur.querySelector('iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.title = 'Menu';
    conteneur.appendChild(iframe);
  }
  iframe.srcdoc = html;
  menuEtatAffiche = JSON.stringify(appData.menu || null);
}

// Appelé par l'iframe après chaque action : l'iframe connaît déjà cet état.
function menuApresAction() {
  menuEtatAffiche = JSON.stringify(appData.menu || null);
}

function menuAppliquerDonnees() {
  MenuEngine.setData(menuDonnees.base, menuDonnees.catalogue);
  MenuEngine.importerEtatInitial(menuDonnees.etatInitial);
  const info = document.getElementById('menutool-info');
  if (info) info.textContent = t('menutool.publishedOn', { date: menuDateLisible(menuDonnees.base.genere_le) });
  menuAfficherIframe();
}

async function menuCharger(forcer = false) {
  if (menuChargement) return menuChargement;
  menuChargement = (async () => {
    try {
      if (!menuDonnees) {
        const cache = await menuCacheLire();
        if (cache) {
          menuDonnees = cache;
          menuAppliquerDonnees();
        }
      }
      if (!isSyncEnabled()) {
        if (!menuDonnees) menuStatut('menutool.noSync', 'error');
        return;
      }
      if (!forcer && menuDonnees && Date.now() - menuDerniereVerif < MENU_VERIF_MS) return;
      if (!menuDonnees) menuStatut('menutool.loading', 'info');
      menuDerniereVerif = Date.now();
      const resultat = await menuSynchroniserDonnees();
      if (resultat.etat === 'non-publie') {
        menuStatut('menutool.notPublished', 'error');
      } else if (resultat.etat === 'telecharge' || resultat.etat === 'charge') {
        menuAppliquerDonnees();
        menuStatut('menutool.updated', 'success', { date: menuDateLisible(menuDonnees.base.genere_le) });
      } else {
        menuStatut('', 'info');
      }
    } catch (error) {
      console.error('Menu', error);
      if (menuDonnees) menuStatut('menutool.offline', 'info', { date: menuDateLisible(menuDonnees.base.genere_le) });
      else menuStatut('menutool.error', 'error', { message: error.message });
    } finally {
      menuChargement = null;
    }
  })();
  return menuChargement;
}

// À l'ouverture de l'onglet : vérifie les mises à jour et, si l'état a changé
// ailleurs (autre appareil), recharge l'iframe pour l'afficher.
function menuOnglet() {
  menuCharger();
  if (menuDonnees && menuEtatAffiche !== null && menuEtatAffiche !== JSON.stringify(appData.menu || null)) {
    menuAfficherIframe();
  }
}

function initMenuTool() {
  const bouton = document.getElementById('menutool-refresh');
  if (bouton) bouton.addEventListener('click', () => menuCharger(true));
  const lien = document.querySelector('.tab-link[data-target="menutool"]');
  if (lien) lien.addEventListener('click', menuOnglet);
  if (document.querySelector('#menutool.tab-panel.active')) menuOnglet();
}
