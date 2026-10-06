/* ═══════════════════════════════════════════════════════════
   NOTES
   Chargé avant script.js (cœur : données, traductions, onglets, démarrage).
   ═══════════════════════════════════════════════════════════ */

function getNotesEditorElement() {
  return document.getElementById('notes-editor');
}

function getActiveNotePage() {
  if (!appData.notes || !Array.isArray(appData.notes.pages)) return null;
  return appData.notes.pages.find((page) => page.id === appData.notes.activePageId) || null;
}

function syncActiveNoteContent() {
  const editor = getNotesEditorElement();
  const activePage = getActiveNotePage();
  if (!editor || !activePage) return;
  activePage.content = editor.innerHTML;
}

function renderNotesList() {
  const list = document.getElementById('notes-page-list');
  if (!list) return;
  list.innerHTML = '';

  appData.notes.pages.forEach((page) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'notes-page-item';
    if (page.id === appData.notes.activePageId) {
      button.classList.add('active');
    }
    const fallbackName = t('notes.defaultPageName', { index: appData.notes.pages.indexOf(page) + 1 });
    button.textContent = page.name || fallbackName;
    button.addEventListener('click', () => {
      setActiveNotePage(page.id);
    });
    list.appendChild(button);
  });
}

function renderNotesEditor() {
  const editor = getNotesEditorElement();
  if (!editor) return;
  const activePage = getActiveNotePage();
  editor.innerHTML = activePage && typeof activePage.content === 'string' ? activePage.content : '';
}

function renderNotes() {
  renderNotesList();
  renderNotesEditor();
}

function setActiveNotePage(pageId) {
  if (!appData.notes.pages.some((page) => page.id === pageId)) return;
  syncActiveNoteContent();
  appData.notes.activePageId = pageId;
  renderNotes();
  saveData();
}

function addNotePage() {
  syncActiveNoteContent();
  const name = prompt(t('notes.newPagePrompt'), t('notes.defaultPageName', { index: appData.notes.pages.length + 1 }));
  const trimmed = name && name.trim();
  const page = {
    id: uid(),
    name: trimmed || t('notes.defaultPageName', { index: appData.notes.pages.length + 1 }),
    content: ''
  };
  appData.notes.pages.push(page);
  appData.notes.activePageId = page.id;
  renderNotes();
  saveData();
  const editor = getNotesEditorElement();
  if (editor) {
    editor.focus();
  }
}

function renameNotePage() {
  const activePage = getActiveNotePage();
  if (!activePage) return;
  const name = prompt(t('notes.renamePagePrompt'), activePage.name);
  if (name === null) return;
  activePage.name = name.trim() || activePage.name || t('notes.defaultPageName', { index: 1 });
  renderNotesList();
  saveData();
}

function deleteNotePage() {
  if (appData.notes.pages.length <= 1) {
    alert(t('notes.lastPageAlert'));
    return;
  }
  const activePage = getActiveNotePage();
  if (!activePage) return;
  if (!confirm(t('notes.deleteConfirm', { name: activePage.name || '' }))) return;
  appData.notes.pages = appData.notes.pages.filter((page) => page.id !== activePage.id);
  appData.notes.activePageId = appData.notes.pages[0].id;
  renderNotes();
  saveData();
}

function applyNotesCommand(command, value = null) {
  const editor = getNotesEditorElement();
  if (!editor) return;
  editor.focus();
  document.execCommand('styleWithCSS', false, true);
  document.execCommand(command, false, value);
  syncActiveNoteContent();
  saveData();
}

function initNotesToolbar() {
  const editor = getNotesEditorElement();
  const toolbarButtons = document.querySelectorAll('.notes-tool[data-command]');
  toolbarButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      if (command) {
        applyNotesCommand(command);
      }
    });
  });

  const fontSize = document.getElementById('notes-font-size');
  if (fontSize) {
    fontSize.addEventListener('change', () => {
      applyNotesCommand('fontSize', fontSize.value);
    });
  }

  const textColor = document.getElementById('notes-text-color');
  if (textColor) {
    textColor.addEventListener('change', () => {
      applyNotesCommand('foreColor', textColor.value);
    });
  }

  const highlight = document.getElementById('notes-highlight');
  if (highlight) {
    highlight.addEventListener('change', () => {
      if (document.queryCommandSupported('hiliteColor')) {
        applyNotesCommand('hiliteColor', highlight.value);
      } else {
        applyNotesCommand('backColor', highlight.value);
      }
    });
  }

  if (editor) {
    editor.addEventListener('input', () => {
      syncActiveNoteContent();
      saveDataSoon();
    });
  }
}

function initNotes() {
  const addBtn = document.getElementById('notes-add-page');
  const renameBtn = document.getElementById('notes-rename-page');
  const deleteBtn = document.getElementById('notes-delete-page');

  if (addBtn) {
    addBtn.addEventListener('click', addNotePage);
  }
  if (renameBtn) {
    renameBtn.addEventListener('click', renameNotePage);
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', deleteNotePage);
  }

  initNotesToolbar();
  renderNotes();
}
