/* ═══════════════════════════════════════════════════════════
   RÉVISIONS : FICHES DE RÉVISIONS
   - Une fiche par thème, classée par matière puis par chapitre.
   - Les mots à retrouver sont cachés dans des cases grises : un clic
     fait apparaître la correction, un second clic la recache.
   - Import depuis un fichier texte (Markdown + {{mot caché}}).
   - Stockage : appData.anki.sheets (liste d'objets à id, fusionnée
     par la synchro comme le reste des données de l'onglet).
   ═══════════════════════════════════════════════════════════ */

const FICHES_MODE_KEY = 'mydesk-rev-mode';
const FICHES_UI_KEY = 'mydesk-fiches-ui';
const FICHES_HUES = [215, 160, 25, 330, 265, 190, 45, 350];

const FICHES_FORMAT_EXAMPLE = `Matière: Droit des sociétés
Chapitre: 1 - Les sociétés commerciales
Titre: La SARL

## Définition
- Société à responsabilité {{limitée}} aux apports
- Entre {{2}} et {{100}} associés
> Astuce : SARL = pas de {{capital minimum}}

## Gérance
| Élément | Règle |
|---|---|
| Nomination | {{statuts ou acte séparé}} |
| Durée | {{6 ans}} si non précisée |

===
Titre: La SAS

## Définition
- Liberté {{statutaire}} très large
- Dirigée par un {{président}}`;

let fichesMode = 'cards';
let fichesUi = { view: 'home', subject: '', sheetId: '', draft: null, flash: '' };

/* ── Données ───────────────────────────────────────────────── */

function fichesSheets() {
  if (!ankiIsObject(appData.anki)) appData.anki = {};
  if (!Array.isArray(appData.anki.sheets)) appData.anki.sheets = [];
  return appData.anki.sheets;
}

function fichesGapCount(body) {
  return (String(body).match(/\{\{[\s\S]+?\}\}/g) || []).length;
}

function fichesNatural(a, b) {
  return String(a).localeCompare(String(b), 'fr', { numeric: true, sensitivity: 'base' });
}

function fichesHue(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return FICHES_HUES[hash % FICHES_HUES.length];
}

function fichesSubjects() {
  const map = new Map();
  fichesSheets().forEach((sheet) => {
    if (!map.has(sheet.subject)) map.set(sheet.subject, []);
    map.get(sheet.subject).push(sheet);
  });
  return Array.from(map.entries()).sort((a, b) => fichesNatural(a[0], b[0]));
}

function fichesChapters(sheets) {
  const map = new Map();
  sheets.forEach((sheet) => {
    if (!map.has(sheet.chapter)) map.set(sheet.chapter, []);
    map.get(sheet.chapter).push(sheet);
  });
  return Array.from(map.entries()).sort((a, b) => fichesNatural(a[0], b[0]));
}

// Fiches d'une matière dans l'ordre d'affichage (chapitres triés).
function fichesOrdered(subject) {
  const sheets = fichesSheets().filter((sheet) => sheet.subject === subject);
  return fichesChapters(sheets).flatMap(([, list]) => list);
}

/* ── Lecture du fichier texte ──────────────────────────────── */

// Fiches séparées par une ligne « === ». En tête de chaque fiche :
// Matière / Chapitre / Titre (matière et chapitre se retiennent d'une fiche
// à l'autre). Le reste est le contenu de la fiche.
function fichesParse(text) {
  const blocks = String(text || '').replace(/\r\n?/g, '\n').split(/^[ \t]*={3,}[ \t]*$/m);
  const out = [];
  let subject = '';
  let chapter = '';
  blocks.forEach((block) => {
    let title = '';
    let started = false;
    const lines = [];
    block.split('\n').forEach((line) => {
      if (!started) {
        const meta = line.match(/^\s*(mati[eè]re|chapitre|titre)\s*[:：]\s*(.*)$/i);
        if (meta) {
          const key = meta[1].toLowerCase();
          const value = meta[2].trim();
          if (key === 'chapitre') chapter = value;
          else if (key === 'titre') title = value;
          else subject = value;
          return;
        }
        if (!line.trim()) return;
        started = true;
      }
      lines.push(line);
    });
    let body = lines.join('\n').replace(/\s+$/, '');
    const heading = body.match(/^#[ \t]+(.+)\n?/);
    if (heading) {
      if (!title) title = heading[1].trim();
      body = body.slice(heading[0].length).replace(/^\s*\n/, '');
    }
    if (!title || !body.trim()) return;
    out.push({ subject: subject || 'Sans matière', chapter: chapter || 'Sans chapitre', title, body });
  });
  return out;
}

/* ── Affichage d'une fiche ─────────────────────────────────── */

function fichesFormat(parent, text) {
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match;
  while ((match = re.exec(text))) {
    if (match.index > last) parent.appendChild(document.createTextNode(text.slice(last, match.index)));
    parent.appendChild(ankiEl(match[1] !== undefined ? 'strong' : 'em', '', match[1] !== undefined ? match[1] : match[2]));
    last = re.lastIndex;
  }
  if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
}

function fichesInline(parent, raw) {
  const text = String(raw).replace(/\*\*\{\{(.+?)\}\}\*\*/g, '{{**$1**}}');
  const re = /\{\{([\s\S]+?)\}\}/g;
  let last = 0;
  let match;
  while ((match = re.exec(text))) {
    fichesFormat(parent, text.slice(last, match.index));
    const gap = ankiEl('button', 'fiche-gap');
    gap.type = 'button';
    gap.setAttribute('aria-pressed', 'false');
    fichesFormat(gap, match[1].trim());
    parent.appendChild(gap);
    last = re.lastIndex;
  }
  fichesFormat(parent, text.slice(last));
}

function fichesBuildBody(root, body) {
  const lines = String(body).replace(/\r\n?/g, '\n').split('\n');
  let section = null;
  let sectionBody = null;
  let sectionIndex = 0;
  let stack = [];
  let table = null;

  const openSection = (title) => {
    section = ankiEl('section', 'fiche-sec');
    if (title !== null) {
      section.style.setProperty('--h', FICHES_HUES[sectionIndex % FICHES_HUES.length]);
      sectionIndex += 1;
      const heading = ankiEl('h3', 'fiche-sec__title');
      fichesInline(heading, title);
      section.appendChild(heading);
    } else {
      section.classList.add('fiche-sec--plain');
    }
    sectionBody = ankiEl('div', 'fiche-sec__body');
    section.appendChild(sectionBody);
    root.appendChild(section);
  };
  const target = () => {
    if (!section) openSection(null);
    return sectionBody;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      table = null;
      continue;
    }
    const h2 = line.match(/^##[ \t]+(.*)$/);
    const h3 = line.match(/^#{3,}[ \t]+(.*)$/);
    const item = line.match(/^(\s*)([-*•]|\d+[.)])[ \t]+(.*)$/);
    const row = /^\s*\|.*\|\s*$/.test(line);
    stack = item ? stack : [];
    if (!row) table = null;

    if (h2) {
      stack = [];
      openSection(h2[1].trim());
    } else if (h3) {
      const heading = ankiEl('h4', 'fiche-sub');
      fichesInline(heading, h3[1].trim());
      target().appendChild(heading);
    } else if (/^\s*-{3,}\s*$/.test(line)) {
      // séparateur : ignoré
    } else if (row) {
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
      if (cells.every((cell) => /^:?-{2,}:?$/.test(cell))) continue;
      if (!table) {
        const wrap = ankiEl('div', 'fiche-table-wrap');
        table = ankiEl('table', 'fiche-table');
        const below = (lines[i + 1] || '').trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
        table.dataset.header = below.length && below.every((cell) => /^:?-{2,}:?$/.test(cell)) ? '1' : '';
        wrap.appendChild(table);
        target().appendChild(wrap);
      }
      const isHead = table.dataset.header === '1' && !table.rows.length;
      const tr = table.insertRow();
      cells.forEach((cell) => {
        const td = ankiEl(isHead ? 'th' : 'td');
        fichesInline(td, cell);
        tr.appendChild(td);
      });
    } else if (item) {
      const indent = item[1].replace(/\t/g, '  ').length;
      const ordered = /\d/.test(item[2]);
      while (stack.length && indent < stack[stack.length - 1].indent) stack.pop();
      let top = stack[stack.length - 1];
      if (!top || indent > top.indent) {
        const list = ankiEl(ordered ? 'ol' : 'ul', 'fiche-list');
        const host = top ? top.el.lastElementChild || top.el : target();
        host.appendChild(list);
        top = { indent, el: list };
        stack.push(top);
      }
      const li = ankiEl('li');
      fichesInline(li, item[3]);
      top.el.appendChild(li);
    } else if (/^\s*>/.test(line)) {
      const note = ankiEl('p', 'fiche-note');
      fichesInline(note, line.replace(/^\s*>\s?/, ''));
      target().appendChild(note);
    } else {
      const p = ankiEl('p', 'fiche-p');
      fichesInline(p, line.trim());
      target().appendChild(p);
    }
  }
}

/* ── Navigation ────────────────────────────────────────────── */

function fichesIsActive() {
  const panel = document.getElementById('anki');
  return Boolean(panel && panel.classList.contains('active'));
}

function fichesModeIsSheets() {
  return fichesMode === 'sheets';
}

function fichesSaveUi() {
  try {
    localStorage.setItem(FICHES_MODE_KEY, fichesMode);
    localStorage.setItem(FICHES_UI_KEY, JSON.stringify({ view: fichesUi.view, subject: fichesUi.subject, sheetId: fichesUi.sheetId }));
  } catch (error) {
    // stockage indisponible : rien à retenir
  }
}

function fichesRestoreUi() {
  try {
    if (localStorage.getItem(FICHES_MODE_KEY) === 'sheets') fichesMode = 'sheets';
    const ui = JSON.parse(localStorage.getItem(FICHES_UI_KEY) || 'null');
    if (ui && ['home', 'subject', 'sheet'].includes(ui.view)) {
      fichesUi.view = ui.view;
      fichesUi.subject = typeof ui.subject === 'string' ? ui.subject : '';
      fichesUi.sheetId = typeof ui.sheetId === 'string' ? ui.sheetId : '';
    }
  } catch (error) {
    // données illisibles : on repart de l'accueil
  }
}

function fichesGo(view, patch = {}) {
  fichesUi = { ...fichesUi, view, ...patch };
  fichesRender();
  const panel = document.getElementById('anki');
  if (panel && panel.scrollIntoView && window.scrollY > panel.offsetTop) panel.scrollIntoView({ block: 'start' });
}

function fichesSetMode(mode) {
  fichesMode = mode;
  fichesSaveUi();
  fichesApplyMode();
  if (mode === 'sheets') fichesRender();
  else if (typeof renderAnki === 'function') renderAnki(true);
}

function fichesApplyMode() {
  const app = document.querySelector('#anki .anki-app');
  if (app) app.classList.toggle('rev-sheets', fichesMode === 'sheets');
  document.querySelectorAll('#rev-mode .rev-mode__btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === fichesMode);
  });
}

// Appelé par renderAnki (synchro, changement de langue…) : on ne redessine
// pas un formulaire en cours de saisie.
function fichesRefresh() {
  if (fichesMode !== 'sheets' || !['home', 'subject', 'sheet'].includes(fichesUi.view)) return;
  fichesRender();
}

function fichesRender() {
  const main = document.getElementById('fiches-main');
  if (!main) return;
  main.innerHTML = '';
  const sheets = fichesSheets();
  if (fichesUi.view === 'sheet' && !sheets.some((sheet) => sheet.id === fichesUi.sheetId)) fichesUi.view = fichesUi.subject ? 'subject' : 'home';
  if ((fichesUi.view === 'subject' || fichesUi.view === 'sheet') && !sheets.some((sheet) => sheet.subject === fichesUi.subject)) {
    fichesUi.view = 'home';
    fichesUi.subject = '';
  }
  const views = {
    home: fichesRenderHome,
    subject: fichesRenderSubject,
    sheet: fichesRenderSheet,
    edit: fichesRenderEdit,
    import: fichesRenderImport
  };
  (views[fichesUi.view] || fichesRenderHome)(main);
  fichesSaveUi();
}

function fichesFlash(main) {
  if (!fichesUi.flash) return;
  main.appendChild(ankiEl('p', 'anki-status anki-status--info fiches-flash', fichesUi.flash));
  fichesUi.flash = '';
}

function fichesHead(main, title, buttons) {
  const head = ankiEl('div', 'anki-card__head');
  head.appendChild(ankiEl('h2', 'anki-title', title));
  const actions = ankiEl('div', 'fiches-actions');
  buttons.forEach((button) => actions.appendChild(button));
  head.appendChild(actions);
  main.appendChild(head);
}

/* ── Accueil : les matières ────────────────────────────────── */

function fichesRenderHome(main) {
  fichesFlash(main);
  fichesHead(main, 'Fiches de révisions', [
    ankiButton('anki-btn anki-btn--ghost', '＋ Nouvelle fiche', () => fichesGo('edit', { sheetId: '' })),
    ankiButton('anki-btn', '📥 Importer', () => fichesGo('import', { draft: null }))
  ]);
  const subjects = fichesSubjects();
  if (!subjects.length) {
    const card = ankiEl('div', 'anki-card');
    card.appendChild(ankiEl('p', 'anki-muted', 'Aucune fiche pour l’instant. Importe un fichier .txt de fiches (je les prépare à partir de tes cours) ou crée-en une à la main.'));
    main.appendChild(card);
    return;
  }
  const grid = ankiEl('div', 'fiches-grid');
  subjects.forEach(([subject, sheets]) => {
    const done = sheets.filter((sheet) => sheet.mastered).length;
    const tile = ankiEl('button', 'fiches-subject');
    tile.type = 'button';
    tile.style.setProperty('--h', fichesHue(subject));
    tile.appendChild(ankiEl('strong', 'fiches-subject__name', subject));
    tile.appendChild(ankiEl('span', 'fiches-subject__meta', `${sheets.length} fiche${sheets.length > 1 ? 's' : ''} · ${fichesChapters(sheets).length} chapitre${fichesChapters(sheets).length > 1 ? 's' : ''}`));
    const bar = ankiEl('span', 'fiches-bar');
    const fill = ankiEl('span', 'fiches-bar__fill');
    fill.style.width = `${Math.round((done / sheets.length) * 100)}%`;
    bar.appendChild(fill);
    tile.appendChild(bar);
    tile.appendChild(ankiEl('span', 'fiches-subject__meta', `${done}/${sheets.length} maîtrisée${done > 1 ? 's' : ''}`));
    tile.addEventListener('click', () => fichesGo('subject', { subject }));
    grid.appendChild(tile);
  });
  main.appendChild(grid);
}

/* ── Une matière : fiches par chapitre ─────────────────────── */

function fichesRenderSubject(main) {
  const subject = fichesUi.subject;
  const sheets = fichesSheets().filter((sheet) => sheet.subject === subject);
  const hue = fichesHue(subject);
  fichesFlash(main);
  const wrap = ankiEl('div', 'fiches-subjectview');
  wrap.style.setProperty('--h', hue);
  main.appendChild(wrap);
  fichesHead(wrap, subject, [
    ankiButton('anki-btn anki-btn--ghost', '← Matières', () => fichesGo('home', { subject: '' })),
    ankiButton('anki-btn', '📥 Importer', () => fichesGo('import', { draft: null }))
  ]);
  fichesChapters(sheets).forEach(([chapter, list]) => {
    const block = ankiEl('section', 'fiches-chapter');
    block.appendChild(ankiEl('h3', 'fiches-chapter__title', chapter));
    const grid = ankiEl('div', 'fiches-grid fiches-grid--tiles');
    list.forEach((sheet) => {
      const tile = ankiEl('button', `fiches-tile${sheet.mastered ? ' is-done' : ''}`);
      tile.type = 'button';
      tile.appendChild(ankiEl('strong', 'fiches-tile__title', sheet.title));
      const gaps = fichesGapCount(sheet.body);
      tile.appendChild(ankiEl('span', 'fiches-tile__meta', `${gaps} case${gaps > 1 ? 's' : ''}${sheet.mastered ? ' · ✓ maîtrisée' : ''}`));
      tile.addEventListener('click', () => fichesGo('sheet', { sheetId: sheet.id }));
      grid.appendChild(tile);
    });
    block.appendChild(grid);
    wrap.appendChild(block);
  });
}

/* ── Une fiche à reconstruire ──────────────────────────────── */

function fichesRenderSheet(main) {
  const sheet = fichesSheets().find((item) => item.id === fichesUi.sheetId);
  if (!sheet) return;
  const order = fichesOrdered(sheet.subject);
  const index = order.findIndex((item) => item.id === sheet.id);
  const wrap = ankiEl('div', 'fiches-sheet');
  wrap.style.setProperty('--h', fichesHue(sheet.subject));
  main.appendChild(wrap);

  const bar = ankiEl('div', 'fiches-toolbar');
  bar.appendChild(ankiButton('anki-btn anki-btn--ghost', `← ${sheet.subject}`, () => fichesGo('subject', { subject: sheet.subject })));
  const prev = ankiButton('anki-btn anki-btn--ghost', '‹', () => fichesGo('sheet', { sheetId: order[index - 1].id }), 'Fiche précédente');
  prev.disabled = index <= 0;
  const next = ankiButton('anki-btn anki-btn--ghost', '›', () => fichesGo('sheet', { sheetId: order[index + 1].id }), 'Fiche suivante');
  next.disabled = index >= order.length - 1;
  bar.appendChild(prev);
  bar.appendChild(next);
  const counter = ankiEl('span', 'fiches-counter');
  bar.appendChild(counter);
  bar.appendChild(ankiEl('span', 'fiches-spacer'));
  const showAll = ankiButton('anki-btn anki-btn--ghost', '👁 Tout révéler', () => setAll(true));
  const hideAll = ankiButton('anki-btn anki-btn--ghost', '🙈 Tout cacher', () => setAll(false));
  const mastered = ankiButton('anki-btn', '', () => {
    sheet.mastered = !sheet.mastered;
    saveData();
    drawMastered();
  });
  bar.appendChild(showAll);
  bar.appendChild(hideAll);
  bar.appendChild(mastered);
  wrap.appendChild(bar);

  const paper = ankiEl('article', 'fiches-paper');
  paper.appendChild(ankiEl('p', 'fiches-crumb', `${sheet.subject}  ›  ${sheet.chapter}`));
  paper.appendChild(ankiEl('h2', 'fiches-paper__title', sheet.title));
  const content = ankiEl('div', 'fiches-content');
  fichesBuildBody(content, sheet.body);
  paper.appendChild(content);
  wrap.appendChild(paper);

  const footer = ankiEl('div', 'fiches-actions fiches-footer');
  footer.appendChild(ankiButton('anki-btn anki-btn--ghost', '✏️ Modifier', () => fichesGo('edit', { sheetId: sheet.id })));
  footer.appendChild(
    ankiButton('anki-btn anki-btn--ghost', '🗑 Supprimer', () => {
      if (!window.confirm(`Supprimer la fiche « ${sheet.title} » ?`)) return;
      appData.anki.sheets = fichesSheets().filter((item) => item.id !== sheet.id);
      ankiMarkDelete();
      saveData();
      fichesGo('subject', { sheetId: '' });
    })
  );
  wrap.appendChild(footer);

  const gaps = () => Array.from(content.querySelectorAll('.fiche-gap'));
  function update() {
    const all = gaps();
    const open = all.filter((gap) => gap.classList.contains('is-open')).length;
    counter.textContent = all.length ? `${open}/${all.length} cases révélées` : 'Aucune case à cacher';
    showAll.disabled = !all.length || open === all.length;
    hideAll.disabled = !open;
  }
  function setAll(open) {
    gaps().forEach((gap) => {
      gap.classList.toggle('is-open', open);
      gap.setAttribute('aria-pressed', String(open));
    });
    update();
  }
  function drawMastered() {
    mastered.textContent = sheet.mastered ? '✓ Maîtrisée' : '☐ Marquer maîtrisée';
    mastered.classList.toggle('fiches-mastered', Boolean(sheet.mastered));
  }
  content.addEventListener('click', (event) => {
    const gap = event.target.closest('.fiche-gap');
    if (!gap) return;
    const open = gap.classList.toggle('is-open');
    gap.setAttribute('aria-pressed', String(open));
    update();
  });
  drawMastered();
  update();
}

/* ── Créer / modifier une fiche ────────────────────────────── */

function fichesRenderEdit(main) {
  const existing = fichesSheets().find((sheet) => sheet.id === fichesUi.sheetId) || null;
  const card = ankiEl('div', 'anki-card fiches-form');
  card.appendChild(ankiEl('h2', 'anki-title', existing ? 'Modifier la fiche' : 'Nouvelle fiche'));

  const field = (label, value, listId) => {
    const row = ankiEl('label', 'anki-field');
    row.appendChild(ankiEl('span', 'anki-field__label', label));
    const input = ankiEl('input');
    input.type = 'text';
    input.value = value;
    if (listId) input.setAttribute('list', listId);
    row.appendChild(input);
    card.appendChild(row);
    return input;
  };
  const subjectList = ankiEl('datalist');
  subjectList.id = 'fiches-subject-list';
  fichesSubjects().forEach(([name]) => {
    const option = ankiEl('option');
    option.value = name;
    subjectList.appendChild(option);
  });
  card.appendChild(subjectList);
  const subject = field('Matière', existing ? existing.subject : fichesUi.subject, 'fiches-subject-list');
  const chapter = field('Chapitre', existing ? existing.chapter : '');
  const title = field('Titre de la fiche', existing ? existing.title : '');

  const bodyRow = ankiEl('label', 'anki-field');
  bodyRow.appendChild(ankiEl('span', 'anki-field__label', 'Contenu (## Titre de section, - liste, | tableau |, {{mot caché}})'));
  const body = ankiEl('textarea', 'fiches-textarea');
  body.rows = 18;
  body.value = existing ? existing.body : '';
  bodyRow.appendChild(body);
  card.appendChild(bodyRow);

  const message = ankiEl('p', 'anki-form__message error');
  card.appendChild(message);
  const actions = ankiEl('div', 'anki-actions');
  actions.appendChild(
    ankiButton('anki-btn', 'Enregistrer', () => {
      if (!subject.value.trim() || !chapter.value.trim() || !title.value.trim() || !body.value.trim()) {
        message.textContent = 'Matière, chapitre, titre et contenu sont obligatoires.';
        return;
      }
      let sheet = existing;
      if (!sheet) {
        sheet = { id: uid(), mastered: false, created: Date.now() };
        fichesSheets().push(sheet);
      }
      Object.assign(sheet, { subject: subject.value.trim(), chapter: chapter.value.trim(), title: title.value.trim(), body: body.value.replace(/\s+$/, '') });
      saveData();
      fichesGo('sheet', { subject: sheet.subject, sheetId: sheet.id });
    })
  );
  actions.appendChild(ankiButton('anki-btn anki-btn--ghost', 'Annuler', () => fichesGo(existing ? 'sheet' : fichesUi.subject ? 'subject' : 'home')));
  card.appendChild(actions);
  main.appendChild(card);
}

/* ── Importer un fichier texte ─────────────────────────────── */

function fichesRenderImport(main) {
  const card = ankiEl('div', 'anki-card fiches-import');
  card.appendChild(ankiEl('h2', 'anki-title', 'Importer des fiches'));
  card.appendChild(
    ankiEl('p', 'anki-muted', 'Choisis un ou plusieurs fichiers .txt (ou colle le texte). Une fiche déjà présente (même matière, chapitre et titre) est mise à jour sans perdre son état « maîtrisée ».')
  );

  const help = ankiEl('details', 'fiches-help');
  help.appendChild(ankiEl('summary', '', 'Voir le format du fichier'));
  help.appendChild(ankiEl('p', 'anki-muted', 'Fiches séparées par une ligne « === ». Matière et chapitre se retiennent d’une fiche à la suivante. {{…}} = case grise à retrouver.'));
  help.appendChild(ankiEl('pre', 'fiches-example', FICHES_FORMAT_EXAMPLE));
  card.appendChild(help);

  const fileLabel = ankiEl('label', 'anki-btn anki-file');
  fileLabel.appendChild(document.createTextNode('Choisir des fichiers .txt'));
  const input = ankiEl('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = '.txt,.md,text/plain,text/markdown';
  fileLabel.appendChild(input);
  card.appendChild(fileLabel);

  const paste = ankiEl('textarea', 'fiches-textarea');
  paste.rows = 6;
  paste.placeholder = 'Ou colle ici le contenu du fichier…';
  card.appendChild(paste);
  const analyse = ankiButton('anki-btn anki-btn--ghost', 'Analyser le texte collé', () => {
    fichesUi.draft = { name: 'Texte collé', items: fichesParse(paste.value) };
    drawPreview();
  });
  card.appendChild(analyse);

  const preview = ankiEl('div', 'fiches-import__preview');
  card.appendChild(preview);
  card.appendChild(ankiButton('anki-btn anki-btn--ghost', '← Retour', () => fichesGo(fichesUi.subject ? 'subject' : 'home')));
  main.appendChild(card);

  function drawPreview() {
    preview.innerHTML = '';
    const draft = fichesUi.draft;
    if (!draft) return;
    if (!draft.items.length) {
      preview.appendChild(ankiEl('p', 'anki-form__message error', 'Aucune fiche trouvée : vérifie le format (Titre + contenu).'));
      return;
    }
    const known = new Set(fichesSheets().map((sheet) => fichesKey(sheet)));
    const fresh = draft.items.filter((item) => !known.has(fichesKey(item))).length;
    preview.appendChild(ankiEl('p', 'anki-big', `${draft.name} : ${draft.items.length} fiche(s) trouvée(s) (${fresh} nouvelle(s), ${draft.items.length - fresh} à mettre à jour)`));
    const list = ankiEl('ul', 'fiches-import__list');
    fichesChapters(draft.items.map((item) => ({ ...item, chapter: `${item.subject} › ${item.chapter}` }))).forEach(([name, items]) => {
      const li = ankiEl('li');
      li.appendChild(ankiEl('strong', '', name));
      li.appendChild(document.createTextNode(` : ${items.map((item) => item.title).join(', ')}`));
      list.appendChild(li);
    });
    preview.appendChild(list);
    preview.appendChild(ankiButton('anki-btn anki-btn--big', 'Importer', () => fichesRunImport(draft.items)));
  }

  input.addEventListener('change', async () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    const items = [];
    for (const file of files) items.push(...fichesParse(await file.text()));
    fichesUi.draft = { name: files.length === 1 ? files[0].name : `${files.length} fichiers`, items };
    drawPreview();
  });
  drawPreview();
}

function fichesKey(sheet) {
  return [sheet.subject, sheet.chapter, sheet.title].map((part) => String(part).trim().toLowerCase()).join('\u0001');
}

function fichesRunImport(items) {
  const sheets = fichesSheets();
  const byKey = new Map(sheets.map((sheet) => [fichesKey(sheet), sheet]));
  let added = 0;
  let updated = 0;
  items.forEach((item) => {
    const existing = byKey.get(fichesKey(item));
    if (existing) {
      existing.body = item.body;
      updated += 1;
    } else {
      const sheet = { id: uid(), ...item, mastered: false, created: Date.now() };
      sheets.push(sheet);
      byKey.set(fichesKey(sheet), sheet);
      added += 1;
    }
  });
  saveData();
  fichesUi.flash = `Import terminé : ${added} fiche(s) ajoutée(s), ${updated} mise(s) à jour.`;
  fichesGo('home', { subject: '', draft: null });
}

/* ── Démarrage ─────────────────────────────────────────────── */

function initFiches() {
  const switcher = document.getElementById('rev-mode');
  if (!switcher) return;
  fichesSheets();
  fichesRestoreUi();
  [
    ['cards', '🧠 Flashcards'],
    ['sheets', '📋 Fiches de révisions']
  ].forEach(([mode, label]) => {
    const button = ankiButton('rev-mode__btn', label, () => fichesSetMode(mode));
    button.dataset.mode = mode;
    switcher.appendChild(button);
  });
  fichesApplyMode();
  if (fichesMode === 'sheets') fichesRender();
}
