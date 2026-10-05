/* ═══════════════════════════════════════════════════════════
   ONGLET PATCH-NOTES
   Toutes les nouveautés depuis le début du fork (28/09/2026),
   de la plus récente à la plus ancienne. À compléter à chaque
   nouvelle fonctionnalité : ajouter une ligne dans PATCH_NOTES
   (même date = même bloc). « Nouveau » et la pastille sur l'onglet
   se basent sur la date de la dernière visite (localStorage).
   ═══════════════════════════════════════════════════════════ */

const PATCH_NOTES_SEEN_KEY = 'mydesk-patchnotes-seen';

// area : app | sync | calendar | anki | sport | news | todo | menu
const PATCH_NOTES = [
  {
    date: '2026-10-05',
    title: 'Résumé de l’actualité à la demande',
    items: [
      { area: 'news', text: 'Bouton « ✨ Générer le résumé » dans Actualité : lance le robot tout de suite. Avec un jeton GitHub dédié (limité au dépôt, permission Actions seulement, gardé sur l’appareil), c’est en un clic ; sinon le bouton explique comment le lancer depuis GitHub.' },
      { area: 'news', text: 'Rattrapage automatique : à l’ouverture de l’onglet, si le résumé du matin ou du soir manque, l’app le demande toute seule au robot.' },
      { area: 'app', text: 'Assistant de démarrage à la première ouverture : langue, style (mode clair/sombre, thème, police, aperçu en direct) puis choix des onglets, avec une description de chacun. Relançable depuis Paramètres ; lien direct vers la synchronisation pour retrouver ses données d’un autre appareil.' },
      { area: 'todo', text: 'To Do : le texte des tâches ne disparaît plus (il se réduisait à une barre vide quand la liste était dessinée onglet fermé).' },
      { area: 'calendar', text: 'Agenda : les heures s’affichent en haut de chaque évènement, même quand le titre prend deux lignes ; un créneau court tient sur une ligne avec son heure de début.' },
      { area: 'news', text: 'Robot plus fiable : 4 passages prévus par heure (GitHub en sautait beaucoup) et nouveaux essais espacés quand Gemini est saturé.' },
      { area: 'menu', text: 'Menu : les repas se comptent en entiers (1 ou 2, jamais 1,5), au choix comme à l’affichage. « Combien de repas ? » reprend le nombre de ta dernière liste pour chaque recette (la box du midi prise pour 7 revient à 7), et un bouton « ✕ Retirer » enlève une recette de la sélection sans quitter la fenêtre.' },
      { area: 'menu', text: 'Menu : « 👤 Mon profil » (sexe, âge, taille, poids, activité) fixe ce que vaut un repas pour toi ; le nombre de repas de chaque recette et ce que la liste achète suivent. Chaque compte garde le sien.' },
      { area: 'menu', text: 'Listes de courses : bouton « 🔄 Recalculer avec le stock » (et recalcul en revenant sur l’onglet), bouton « 🗑️ Supprimer la liste », et quantités arrondies au-dessus — 2 saucisses ou 2 œufs plutôt que 1,5.' },
      { area: 'menu', text: 'Menu réservé : l’onglet n’apparaît (onglets, Paramètres, assistant de démarrage) que sur un appareil synchronisé avec un compte GitHub qui a accès au Gist Menu. Sans ce jeton, ou s’il est retiré, l’onglet disparaît et la copie locale des données Menu est effacée.' },
      { area: 'menu', text: 'Courses : plus jamais d’œufs de poules en cage. Seuls les œufs qui annoncent plein air, sol, bio ou Label Rouge sont proposés (une boîte sans mode d’élevage indiqué est refusée), y compris pour un ancien choix manuel.' },
      { area: 'menu', text: 'Farines : sarrasin (blé noir), pois chiche, riz, châtaigne, épeautre, complète et maïs ne sont plus confondues avec la farine de blé — la farine de blé du stock ne couvre plus des galettes de sarrasin. (Après la prochaine publication depuis le PC.)' },
      { area: 'menu', text: 'Liste de courses : « 🛒 Remplir mon panier U ». La liste s’ouvre sur coursesu.com et un favori « Remplir panier U » (à installer une fois) met tous les produits dans ton panier, avec les bonnes quantités, sur ton compte et ton drive. Recliquer ne double rien.' },
      { area: 'menu', text: 'Menu : 330 ingrédients de recettes mieux reconnus (crozets, passata, beaufort, poissons, pruneaux…) et des prix retrouvés pour la crème végétale, la pâte filo, les galettes de sarrasin, les cacahuètes, l’orange, le Tabasco ou les cèpes, qui comptaient 0 €. (Après la prochaine publication depuis le PC.)' }
    ]
  },
  {
    date: '2026-10-04',
    title: 'Actualité, objectifs de révision et onglets à la carte',
    items: [
      { area: 'news', text: 'Nouvel onglet Actualité : chaque jour, les titres de RFI, France 24, franceinfo, Courrier international, Public Sénat, LCP, du Conseil constitutionnel, du Conseil d’État et de sites juridiques, classés en International, France et Justice & droit.' },
      { area: 'news', text: '« L’essentiel » le matin et le soir : les sujets importants résumés par IA (Gemini), avec une ligne « Pour comprendre » et les liens vers les sources. Si l’IA ne répond pas, les sujets les plus repris par les médias s’affichent à la place.' },
      { area: 'news', text: 'Navigation sur 14 jours, filtres par thème, pastille « Nouveau » et lecture hors connexion de la dernière version.' },
      { area: 'news', text: 'Résumé de la semaine : bouton Jour | Semaine à côté du choix du jour, avec les faits les plus importants de la semaine par thème, condensés et datés. Refait chaque soir.' },
      { area: 'news', text: 'Justice & droit enrichi : Dalloz Actu Étudiant, Libération, RFI, jurisprudence du Conseil d’État, CNIL, Jus Politicum et la Revue des droits et libertés fondamentaux. Son résumé quotidien s’affiche aussi le soir.' },
      { area: 'calendar', text: 'Objectifs de révision (ex. 4 h par semaine) dans la colonne de droite : on attrape un objectif et on le dépose dans l’agenda pour planifier une séance, avec la progression de la semaine.' },
      { area: 'calendar', text: 'Cliquer-glisser vers le bas sur un jour crée un évènement sur la plage choisie et ouvre directement ses détails.' },
      { area: 'todo', text: 'To Do List repensée : listes en cartes colorées avec progression, ajout rapide au clavier (Entrée pour enchaîner, « demain », « vendredi », « 12/10 » pour l’échéance, « ! » pour important), échéances colorées (en retard, aujourd’hui), étoile « importante », tâches faites rangées dans « Terminées ».' },
      { area: 'todo', text: 'To Do List : vues Toutes / Aujourd’hui / Importantes, recherche, résumé de ce qui reste à faire, glisser une tâche pour la déplacer (même vers une autre liste), suppression annulable.' },
      { area: 'menu', text: 'Onglet Menu intégré au site : couleurs, police et mode sombre de MyDesk, navigation Recettes / Courses / À cuisiner / Stock / Catalogue dans la barre du haut (le dernier écran ouvert est retenu), une seule zone qui défile sur toute la hauteur.' },
      { area: 'menu', text: 'Menu en nombre de repas : un repas = ce que mange un homme de 20 ans, 73 kg, 1,85 m (≈ 930 kcal). « Finir la sélection » demande combien de repas faire de chaque recette, la liste achète juste ce qu’il faut, et « À cuisiner », le stock et le journal comptent en repas. (Les écrans changent après la prochaine publication depuis le PC.)' },
      { area: 'menu', text: 'Menu : œufs, concombres, citrons, avocats… comptés à la pièce partout (recettes, stock « 8 œufs », liste de courses « 1 boîte de 10 », prix par pièce), sans poids moyen deviné. Le prix des recettes compte enfin ces ingrédients (l’œuf valait 0 € dans plus de 1 000 recettes).' },
      { area: 'menu', text: 'Liste de courses : quand la recette compte en pièces et le magasin vend au poids (ou l’inverse), plus de conversion devinée — la ligne passe « à choisir », montre ce que demande la recette (« 2 gousses d’ail ») et tous les produits avec leur prix au kg ou à la pièce ; tu prends le paquet et la quantité.' },
      { area: 'app', text: 'Ordre des onglets au choix : glisser un onglet dans la barre (appui long sur téléphone) ou flèches ▲▼ dans Paramètres. L’ordre est synchronisé avec le profil.' },
      { area: 'app', text: 'Nouvel onglet Patch-Notes : toutes les mises à jour depuis le début du fork.' }
    ]
  },
  {
    date: '2026-10-01',
    title: 'Agenda plus souple',
    items: [
      { area: 'calendar', text: 'Lieu pour chaque évènement, avec suggestions des lieux déjà utilisés, affiché sous le titre (repris aussi à l’import .ics).' },
      { area: 'calendar', text: 'Déplacer un évènement en le glissant (appui long sur téléphone). Dans une série, seule la séance déplacée change. Échap annule.' },
      { area: 'calendar', text: 'Abonnement pour le téléphone : un lien d’agenda (.ics) à ajouter dans Google Agenda ou Calendrier, mis à jour à chaque synchro (option dans Synchronisation).' },
      { area: 'calendar', text: 'Clic droit sur un évènement existant : il s’ouvre pour être modifié, au lieu d’en créer un nouveau.' }
    ]
  },
  {
    date: '2026-09-30',
    title: 'Synchro fiable et Révisions plus complètes',
    items: [
      { area: 'sync', text: 'Fusion horodatée : un appareil ou un onglet resté sur une vieille version ne peut plus effacer ni écraser des données plus récentes. Un seul onglet synchronise à la fois.' },
      { area: 'sync', text: 'Historique / restaurer : revenir à une ancienne synchro, en choisissant élément par élément ce qu’on récupère (annulable).' },
      { area: 'anki', text: 'Récupérer des cartes perdues depuis l’historique de la synchro, sans rien supprimer.' },
      { area: 'calendar', text: 'Chevauchements : quand deux évènements se superposent, on choisit le vrai ; les autres deviennent des bandes grises barrées.' },
      { area: 'calendar', text: 'Petite barre rouge à l’heure actuelle sur le jour en cours.' },
      { area: 'anki', text: 'Parcourir : sélection de plusieurs cartes (Maj+clic pour une plage) pour changer leur paquet ou leur tag d’un coup.' },
      { area: 'anki', text: 'Ajout de carte : aucun paquet imposé par défaut ; le dernier paquet utilisé est gardé pour les cartes suivantes.' },
      { area: 'anki', text: 'Partager un paquet : fichier compatible Anki, avec le choix des tags, pour des amis sans compte GitHub.' },
      { area: 'anki', text: 'Marquer une fiche « à confirmer » quand l’info n’est pas sûre (touche C en révision), badge dans Parcourir et recherche is:aconfirmer.' },
      { area: 'sport', text: 'Séances préfaites à choisir une par une, avec jour, heure et répétition pour les placer dans l’agenda.' }
    ]
  },
  {
    date: '2026-09-29',
    title: 'Onglet Révisions',
    items: [
      { area: 'anki', text: 'Nouvel onglet Révisions : cartes mémoire façon Anki avec l’algorithme FSRS. Paquets et sous-paquets, cartes basiques, inversées et à trous, raccourcis clavier, limites par jour.' },
      { area: 'anki', text: 'Import des exports texte d’Anki, recherche dans Parcourir (deck:, tag:, is:…), statistiques (rétention réelle, prévision) et réglages (rétention visée, étapes).' },
      { area: 'anki', text: 'Tags liés au paquet : renommer un tag change toutes ses cartes ; vue Tags pour créer, renommer, fusionner ou supprimer.' },
      { area: 'app', text: 'L’onglet ouvert (et la vue des Révisions) est retrouvé après un rafraîchissement.' }
    ]
  },
  {
    date: '2026-09-28',
    title: 'Début du fork : synchro, Sport, Menu, app installable',
    items: [
      { area: 'sync', text: 'Synchronisation entre appareils via un Gist GitHub privé : mêmes données sur l’ordi et le téléphone.' },
      { area: 'calendar', text: 'Import de fichiers iCalendar (.ics), impression de l’emploi du temps, heure de fin liée à la durée.' },
      { area: 'calendar', text: 'Supprimer ou modifier une seule occurrence d’une série ; annuler / rétablir avec Ctrl+Z.' },
      { area: 'calendar', text: 'Cours plus lisibles : titres complets, poignées de redimensionnement discrètes.' },
      { area: 'sport', text: 'Nouvel onglet Sport : séances au poids du corps, progression guidée par échelles d’exercices, minuteur de repos, guide avec vidéos, lien avec l’agenda.' },
      { area: 'menu', text: 'Nouvel onglet Menu : l’outil Menu utilisable sans le PC.' },
      { area: 'app', text: 'App installable sur téléphone et ordinateur (icônes, bouton Installer), affichage mobile et mode sombre cohérent.' },
      { area: 'app', text: 'Plus de style périmé après une mise à jour (fichiers versionnés).' }
    ]
  }
];

const PATCH_NOTES_AREAS = ['app', 'sync', 'calendar', 'anki', 'sport', 'news', 'todo', 'menu'];

const PATCH_NOTES_TRANSLATIONS = {
  fr: {
    tab: 'Patch-Notes',
    title: '📝 Patch-Notes',
    intro: 'Toutes les mises à jour depuis le début du fork, le 28 septembre 2026.',
    all: 'Tout',
    count: '{count} nouveautés',
    countOne: '1 nouveauté',
    isNew: 'Nouveau',
    newBadge: 'Nouveautés depuis ta dernière visite',
    empty: 'Aucune mise à jour pour ce filtre.',
    areas: { app: 'Application', sync: 'Synchro', calendar: 'Agenda', anki: 'Révisions', sport: 'Sport', news: 'Actualité', todo: 'To Do', menu: 'Menu' }
  },
  en: {
    tab: 'Patch Notes',
    title: '📝 Patch Notes',
    intro: 'Every update since the fork started on 28 September 2026 (notes in French).',
    all: 'All',
    count: '{count} changes',
    countOne: '1 change',
    isNew: 'New',
    newBadge: 'New since your last visit',
    empty: 'No updates for this filter.',
    areas: { app: 'App', sync: 'Sync', calendar: 'Calendar', anki: 'Flashcards', sport: 'Sport', news: 'News', todo: 'To-Do', menu: 'Menu' }
  },
  vi: {
    tab: 'Ghi chú cập nhật',
    title: '📝 Ghi chú cập nhật',
    intro: 'Mọi cập nhật kể từ khi bắt đầu bản fork, ngày 28/09/2026 (bằng tiếng Pháp).',
    all: 'Tất cả',
    count: '{count} thay đổi',
    countOne: '1 thay đổi',
    isNew: 'Mới',
    newBadge: 'Mới kể từ lần ghé trước',
    empty: 'Không có cập nhật cho bộ lọc này.',
    areas: { app: 'Ứng dụng', sync: 'Đồng bộ', calendar: 'Lịch', anki: 'Ôn tập', sport: 'Thể thao', news: 'Tin tức', todo: 'Việc cần làm', menu: 'Thực đơn' }
  }
};

function registerPatchNotesTranslations() {
  Object.keys(translations).forEach((language) => {
    const source = PATCH_NOTES_TRANSLATIONS[language] || PATCH_NOTES_TRANSLATIONS.fr;
    translations[language].patchNotes = source;
    if (translations[language].tabs) translations[language].tabs.patchnotes = source.tab;
  });
}

const patchNotesState = { area: 'all', seenBefore: null };

function patchNotesReadSeen() {
  try {
    return localStorage.getItem(PATCH_NOTES_SEEN_KEY) || '';
  } catch (error) {
    return '';
  }
}

function patchNotesMarkSeen() {
  try {
    localStorage.setItem(PATCH_NOTES_SEEN_KEY, PATCH_NOTES[0].date);
  } catch (error) {
    // stockage indisponible : la pastille reviendra, sans gravité
  }
  patchNotesUpdateDot();
}

// Pastille sur l'onglet quand des notes sont plus récentes que la dernière visite.
function patchNotesUpdateDot() {
  const button = document.querySelector('.tab-link[data-target="patchnotes"]');
  if (!button) return;
  const seen = patchNotesReadSeen();
  const unread = !seen || PATCH_NOTES[0].date > seen;
  button.classList.toggle('has-dot', unread);
  button.title = unread ? t('patchNotes.newBadge') : '';
}

function patchNotesEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined && text !== null) element.textContent = text;
  return element;
}

function patchNotesDateLabel(date) {
  const [year, month, day] = date.split('-').map(Number);
  const label = new Date(year, month - 1, day).toLocaleDateString(getCurrentLocale(), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const text = label.charAt(0).toUpperCase() + label.slice(1);
  return day === 1 && currentLanguage === 'fr' ? text.replace(/ 1 /, ' 1er ') : text;
}

function renderPatchNotes() {
  const container = document.getElementById('patchnotes-app');
  if (!container) return;
  container.innerHTML = '';

  const head = patchNotesEl('header', 'patchnotes-head');
  head.append(patchNotesEl('h2', 'patchnotes-title', t('patchNotes.title')));
  head.append(patchNotesEl('p', 'patchnotes-intro', t('patchNotes.intro')));
  container.append(head);

  const filters = patchNotesEl('div', 'patchnotes-filters');
  ['all', ...PATCH_NOTES_AREAS].forEach((area) => {
    const chip = patchNotesEl(
      'button',
      `patchnotes-chip patchnotes-area--${area}`,
      area === 'all' ? t('patchNotes.all') : t(`patchNotes.areas.${area}`)
    );
    chip.type = 'button';
    chip.classList.toggle('is-active', patchNotesState.area === area);
    chip.setAttribute('aria-pressed', patchNotesState.area === area ? 'true' : 'false');
    chip.addEventListener('click', () => {
      patchNotesState.area = area;
      renderPatchNotes();
    });
    filters.append(chip);
  });
  container.append(filters);

  const seen = patchNotesState.seenBefore;
  const timeline = patchNotesEl('div', 'patchnotes-timeline');
  PATCH_NOTES.forEach((release) => {
    const items = release.items.filter((item) => patchNotesState.area === 'all' || item.area === patchNotesState.area);
    if (!items.length) return;
    const block = patchNotesEl('section', 'patchnotes-release');
    const top = patchNotesEl('div', 'patchnotes-release__head');
    const titles = patchNotesEl('div', 'patchnotes-release__titles');
    titles.append(patchNotesEl('time', 'patchnotes-release__date', patchNotesDateLabel(release.date)));
    titles.lastChild.setAttribute('datetime', release.date);
    titles.append(patchNotesEl('h3', 'patchnotes-release__title', release.title));
    top.append(titles);
    const meta = patchNotesEl('div', 'patchnotes-release__meta');
    // Première visite : seule la dernière mise à jour est « nouvelle ».
    const isNew = seen !== null && (seen ? release.date > seen : release === PATCH_NOTES[0]);
    if (isNew) meta.append(patchNotesEl('span', 'patchnotes-new', t('patchNotes.isNew')));
    meta.append(
      patchNotesEl(
        'span',
        'patchnotes-release__count',
        items.length === 1 ? t('patchNotes.countOne') : t('patchNotes.count', { count: items.length })
      )
    );
    top.append(meta);
    block.append(top);

    const list = patchNotesEl('ul', 'patchnotes-list');
    items.forEach((item) => {
      const row = patchNotesEl('li', 'patchnotes-item');
      row.append(patchNotesEl('span', `patchnotes-tag patchnotes-area--${item.area}`, t(`patchNotes.areas.${item.area}`)));
      row.append(patchNotesEl('span', 'patchnotes-text', item.text));
      list.append(row);
    });
    block.append(list);
    timeline.append(block);
  });
  if (!timeline.children.length) timeline.append(patchNotesEl('p', 'patchnotes-empty', t('patchNotes.empty')));
  container.append(timeline);
}

function initPatchNotes() {
  const panel = document.getElementById('patchnotes');
  if (!panel) return;
  patchNotesUpdateDot();
  let wasActive = false;
  const check = () => {
    const active = panel.classList.contains('active');
    if (active && !wasActive) {
      // « Nouveau » sur ce qui est arrivé depuis la visite précédente.
      patchNotesState.seenBefore = patchNotesReadSeen();
      renderPatchNotes();
      patchNotesMarkSeen();
    }
    wasActive = active;
  };
  new MutationObserver(check).observe(panel, { attributes: true, attributeFilter: ['class'] });
  check();
  renderPatchNotes();
}
