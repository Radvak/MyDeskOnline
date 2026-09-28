/* ═══════════════════════════════════════════════════════════
   ONGLET SPORT
   - Séances (programmes) composées d'exercices
   - Suivi par date : exercices faits + note (reps, variante…)
   - Lien avec l'agenda : un évènement de type « Sport » (ou lié
     à une séance) ouvre cet onglet sur la séance du jour
   - Programme recommandé prêt à charger
   ═══════════════════════════════════════════════════════════ */

const SPORT_TYPE_NAME = 'Sport';
const SPORT_TYPE_COLOR = '#f97316';
const SPORT_CLICK_DELAY_MS = 250;
const SPORT_TEMPLATE_KEY = 'pdc-debutant-pecs-abdos';

const SPORT_TRANSLATIONS = {
  fr: {
    sessionsTitle: 'Séances',
    addSession: 'Nouvelle séance',
    loadProgram: 'Programme recommandé',
    newSessionName: 'Nouvelle séance',
    emptyList: 'Aucune séance. Créez-en une ou chargez le programme recommandé.',
    noSession: 'Sélectionnez ou créez une séance.',
    sessionOf: 'Séance du {date}',
    notPlanned: "Cette séance n'est pas prévue ce jour-là dans l'agenda.",
    plannedOn: 'Prévue : {days}',
    notScheduled: "Pas encore dans l'agenda",
    progress: '{done}/{total} exercices faits',
    nameLabel: 'Nom de la séance',
    descriptionLabel: 'Objectif / consignes',
    exercise: 'Exercice',
    sets: 'Séries',
    reps: 'Répétitions',
    rest: 'Repos (s)',
    tip: 'Consigne',
    todayNote: 'Note du jour',
    todayNotePlaceholder: 'reps faites, variante…',
    addExercise: 'Ajouter un exercice',
    newExercise: 'Nouvel exercice',
    deleteSession: 'Supprimer la séance',
    deleteSessionConfirm: 'Supprimer cette séance ? Ses créneaux dans l\'agenda seront aussi supprimés.',
    deleteExercise: "Supprimer l'exercice",
    scheduleTitle: "Ajouter à l'agenda chaque semaine",
    scheduleDay: 'Jour',
    scheduleTime: 'Heure',
    scheduleDuration: 'Durée (min)',
    scheduleAdd: 'Ajouter',
    scheduled: "Séance ajoutée à l'agenda.",
    prevDay: 'Jour précédent',
    nextDay: 'Jour suivant',
    today: "Aujourd'hui",
    pickSession: "Aucune séance n'est liée à ce créneau. Choisissez-en une :",
    loadConfirm: "Charger le programme recommandé ?\n\n3 séances au poids du corps (débutant, accent pecs et abdos), placées lundi, mercredi et vendredi à 18:00 dans l'agenda. Vous pourrez les déplacer ensuite.",
    alreadyLoaded: 'Le programme recommandé est déjà chargé.',
    loaded: "Programme chargé : 3 séances ajoutées à l'agenda.",
    sessionLabel: 'Séance'
  },
  en: {
    sessionsTitle: 'Workouts',
    addSession: 'New workout',
    loadProgram: 'Recommended program',
    newSessionName: 'New workout',
    emptyList: 'No workouts yet. Create one or load the recommended program.',
    noSession: 'Select or create a workout.',
    sessionOf: 'Workout of {date}',
    notPlanned: 'This workout is not scheduled on this day.',
    plannedOn: 'Scheduled: {days}',
    notScheduled: 'Not in the calendar yet',
    progress: '{done}/{total} exercises done',
    nameLabel: 'Workout name',
    descriptionLabel: 'Goal / instructions',
    exercise: 'Exercise',
    sets: 'Sets',
    reps: 'Reps',
    rest: 'Rest (s)',
    tip: 'Tip',
    todayNote: "Today's note",
    todayNotePlaceholder: 'reps done, variation…',
    addExercise: 'Add exercise',
    newExercise: 'New exercise',
    deleteSession: 'Delete workout',
    deleteSessionConfirm: 'Delete this workout? Its calendar slots will be deleted too.',
    deleteExercise: 'Delete exercise',
    scheduleTitle: 'Add to the calendar every week',
    scheduleDay: 'Day',
    scheduleTime: 'Time',
    scheduleDuration: 'Duration (min)',
    scheduleAdd: 'Add',
    scheduled: 'Workout added to the calendar.',
    prevDay: 'Previous day',
    nextDay: 'Next day',
    today: 'Today',
    pickSession: 'No workout is linked to this slot. Pick one:',
    loadConfirm: 'Load the recommended program?\n\n3 bodyweight workouts (beginner, chest and abs focus), scheduled Monday, Wednesday and Friday at 18:00. You can move them later.',
    alreadyLoaded: 'The recommended program is already loaded.',
    loaded: 'Program loaded: 3 workouts added to the calendar.',
    sessionLabel: 'Workout'
  },
  vi: {
    sessionsTitle: 'Buổi tập',
    addSession: 'Buổi tập mới',
    loadProgram: 'Chương trình đề xuất',
    newSessionName: 'Buổi tập mới',
    emptyList: 'Chưa có buổi tập. Hãy tạo mới hoặc tải chương trình đề xuất.',
    noSession: 'Chọn hoặc tạo một buổi tập.',
    sessionOf: 'Buổi tập ngày {date}',
    notPlanned: 'Buổi tập này không có lịch vào ngày này.',
    plannedOn: 'Lịch: {days}',
    notScheduled: 'Chưa có trong lịch',
    progress: 'Đã tập {done}/{total} bài',
    nameLabel: 'Tên buổi tập',
    descriptionLabel: 'Mục tiêu / hướng dẫn',
    exercise: 'Bài tập',
    sets: 'Hiệp',
    reps: 'Lần',
    rest: 'Nghỉ (giây)',
    tip: 'Lưu ý',
    todayNote: 'Ghi chú hôm nay',
    todayNotePlaceholder: 'số lần đã làm, biến thể…',
    addExercise: 'Thêm bài tập',
    newExercise: 'Bài tập mới',
    deleteSession: 'Xóa buổi tập',
    deleteSessionConfirm: 'Xóa buổi tập này? Các lịch tương ứng cũng sẽ bị xóa.',
    deleteExercise: 'Xóa bài tập',
    scheduleTitle: 'Thêm vào lịch mỗi tuần',
    scheduleDay: 'Ngày',
    scheduleTime: 'Giờ',
    scheduleDuration: 'Thời lượng (phút)',
    scheduleAdd: 'Thêm',
    scheduled: 'Đã thêm buổi tập vào lịch.',
    prevDay: 'Ngày trước',
    nextDay: 'Ngày sau',
    today: 'Hôm nay',
    pickSession: 'Chưa có buổi tập nào gắn với lịch này. Hãy chọn:',
    loadConfirm: 'Tải chương trình đề xuất?\n\n3 buổi tập với trọng lượng cơ thể (người mới, tập trung ngực và bụng), vào thứ Hai, Tư, Sáu lúc 18:00.',
    alreadyLoaded: 'Chương trình đề xuất đã được tải.',
    loaded: 'Đã tải chương trình: thêm 3 buổi tập vào lịch.',
    sessionLabel: 'Buổi tập'
  }
};

const SPORT_TAB_TRANSLATIONS = { fr: 'Sport', en: 'Sport', vi: 'Thể thao' };

// Programme débutant au poids du corps, 3 séances/semaine, accent pecs + abdos.
// Full body à chaque séance (le plus efficace pour débuter), avec 2 séances
// orientées pecs/abdos et une séance dos/jambes pour l'équilibre et la posture.
const SPORT_PROGRAM = [
  {
    weekday: 1,
    name: 'A — Pecs & abdos',
    description:
      "Échauffement 5 min : jumping jacks, rotations d'épaules et de bras, 10 pompes faciles.\n" +
      "Progression : quand tu fais le haut de la fourchette de répétitions sur toutes les séries, passe à la variante plus dure (ex. pompes sur les genoux → pompes classiques).\n" +
      "Abdos visibles : ils se construisent ici, mais ne se voient qu'avec un taux de graisse assez bas. Alimentation : léger déficit calorique et assez de protéines.",
    exercises: [
      ['Pompes classiques (sur les genoux si besoin)', 4, '8–12', 90, 'Corps gainé, poitrine près du sol, coudes à ~45°.'],
      ['Pompes mains surélevées (chaise ou canapé)', 3, '12–15', 75, 'Cible le bas des pecs. Descente lente (3 s).'],
      ['Squats', 3, '15', 60, 'Talons au sol, dos droit, descends cuisses parallèles au sol.'],
      ['Crunchs', 3, '15', 45, "Monte en soufflant, menton loin de la poitrine, pas d'élan."],
      ['Planche', 3, '30–45 s', 45, 'Fesses alignées, abdos et fessiers serrés.'],
      ['Relevés de jambes allongé', 3, '10–12', 45, 'Bas du dos plaqué au sol, mains sous les fesses si besoin.']
    ]
  },
  {
    weekday: 3,
    name: 'B — Dos, jambes & gainage',
    description:
      "Échauffement 5 min : montées de genoux, rotations de hanches, 10 squats lents.\n" +
      "Le dos et les jambes équilibrent le travail des pecs et améliorent la posture (pecs plus mis en valeur).\n" +
      "Rowing inversé : sous une table très solide, ou avec un sac à dos chargé si ce n'est pas possible.",
    exercises: [
      ['Rowing inversé sous une table (ou rowing sac à dos)', 4, '8–12', 90, 'Tire la poitrine vers la table, omoplates serrées.'],
      ['Fentes alternées', 3, '10 / jambe', 60, 'Genou arrière frôle le sol, buste droit.'],
      ['Pont fessier', 3, '15', 45, 'Serre les fessiers 1 s en haut.'],
      ['Pompes serrées (sur les genoux si besoin)', 3, '6–10', 75, 'Mains sous les épaules, coudes le long du corps.'],
      ['Planche latérale', 3, '20–30 s / côté', 45, 'Hanches hautes, corps aligné.'],
      ['Dead bug', 3, '10 / côté', 45, 'Bas du dos collé au sol, mouvements lents.']
    ]
  },
  {
    weekday: 5,
    name: 'C — Pecs & abdos (volume)',
    description:
      "Échauffement 5 min : jumping jacks, rotations d'épaules, 10 pompes faciles.\n" +
      "Dips entre deux chaises : chaises stables et calées contre un mur. Stoppe si douleur à l'épaule.\n" +
      "Pompes pieds surélevés trop dures au début ? Remplace par des pompes classiques.",
    exercises: [
      ['Pompes larges', 4, '8–12', 90, "Mains plus larges que les épaules, amplitude complète."],
      ['Pompes pieds surélevés', 3, '6–10', 90, 'Cible le haut des pecs. Pieds sur une chaise basse.'],
      ['Dips entre deux chaises', 3, '6–10', 75, "Descends jusqu'à 90° aux coudes, épaules basses."],
      ['Squats', 3, '20', 60, 'Rythme contrôlé.'],
      ['Mountain climbers', 3, '30 s', 45, 'Hanches basses, genoux vers la poitrine.'],
      ['Crunchs vélo', 3, '12 / côté', 45, 'Coude vers le genou opposé, lentement.'],
      ['Hollow hold', 3, '20 s', 45, 'Bas du dos plaqué, bras et jambes tendus.']
    ]
  }
];

let sportSelectedDate = null;
let sportPickerEvent = null;

function registerSportTranslations() {
  Object.keys(SPORT_TRANSLATIONS).forEach((language) => {
    if (!translations[language]) return;
    translations[language].sport = SPORT_TRANSLATIONS[language];
    if (translations[language].tabs) {
      translations[language].tabs.sport = SPORT_TAB_TRANSLATIONS[language];
    }
  });
}

/* ── Données ───────────────────────────────────────────────── */

function ensureSportData() {
  if (!appData.sport || typeof appData.sport !== 'object') {
    appData.sport = { sessions: [], logs: {}, activeSessionId: null };
  }
  if (!Array.isArray(appData.sport.sessions)) appData.sport.sessions = [];
  if (!appData.sport.logs || typeof appData.sport.logs !== 'object') appData.sport.logs = {};
  appData.sport.sessions.forEach((session) => {
    if (!Array.isArray(session.exercises)) session.exercises = [];
  });
  if (!appData.sport.sessions.some((session) => session.id === appData.sport.activeSessionId)) {
    appData.sport.activeSessionId = appData.sport.sessions.length ? appData.sport.sessions[0].id : null;
  }
}

function getSportSession(id) {
  return appData.sport.sessions.find((session) => session.id === id) || null;
}

function getSportType() {
  return appData.calendar.types.find((type) => (type.name || '').trim().toLowerCase() === SPORT_TYPE_NAME.toLowerCase()) || null;
}

function getOrCreateSportType() {
  let type = getSportType();
  if (!type) {
    type = { id: uid(), name: SPORT_TYPE_NAME, color: SPORT_TYPE_COLOR };
    appData.calendar.types.push(type);
  }
  return type;
}

function isSportEvent(event) {
  if (!event) return false;
  if (event.sportSessionId) return true;
  const type = event.typeId ? getEventTypeById(event.typeId) : null;
  return Boolean(type && (type.name || '').trim().toLowerCase() === SPORT_TYPE_NAME.toLowerCase());
}

function sportDateKey(date) {
  return toISODateString(date);
}

function getSportLog(dateKey, sessionId) {
  const day = appData.sport.logs[dateKey];
  return day && day[sessionId] ? day[sessionId] : {};
}

function setSportLog(dateKey, sessionId, exerciseId, patch) {
  if (!appData.sport.logs[dateKey]) appData.sport.logs[dateKey] = {};
  if (!appData.sport.logs[dateKey][sessionId]) appData.sport.logs[dateKey][sessionId] = {};
  const entry = appData.sport.logs[dateKey][sessionId];
  entry[exerciseId] = { ...(entry[exerciseId] || {}), ...patch };
  saveData();
}

// Occurrences de l'agenda liées au sport sur une journée donnée.
function getSportOccurrencesOn(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const savedWeekStart = currentWeekStart;
  currentWeekStart = startOfWeek(day);
  const result = [];
  try {
    appData.calendar.events.filter(isSportEvent).forEach((event) => {
      getOccurrencesForWeek(event).forEach((occurrence) => {
        const start = new Date(occurrence.start);
        if (sportDateKey(start) === sportDateKey(day)) result.push(occurrence);
      });
    });
  } finally {
    currentWeekStart = savedWeekStart;
  }
  return result.sort((a, b) => new Date(a.start) - new Date(b.start));
}

function getSessionWeekdays(sessionId) {
  const days = new Set();
  appData.calendar.events
    .filter((event) => event.sportSessionId === sessionId && event.recurrence === 'weekly')
    .forEach((event) => days.add(new Date(event.start).getDay()));
  return Array.from(days).sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7));
}

function weekdayName(day, format = 'long') {
  // 2023-01-01 est un dimanche.
  return new Date(2023, 0, 1 + day).toLocaleDateString(getCurrentLocale(), { weekday: format });
}

/* ── Navigation depuis l'agenda ────────────────────────────── */

function goToSportTab() {
  const link = document.querySelector('.tab-link[data-target="sport"]');
  if (link && activateTabHandler) activateTabHandler(link);
}

function openSportFromCalendar(occurrence) {
  ensureSportData();
  const event = occurrence.sourceEvent;
  sportSelectedDate = new Date(occurrence.start);
  sportSelectedDate.setHours(0, 0, 0, 0);
  sportPickerEvent = null;
  if (event.sportSessionId && getSportSession(event.sportSessionId)) {
    appData.sport.activeSessionId = event.sportSessionId;
  } else if (appData.sport.sessions.length) {
    sportPickerEvent = event; // créneau sans séance : on propose d'en choisir une
  }
  goToSportTab();
  renderSport();
}

// Branche le clic gauche sur un évènement sport de l'agenda.
function attachSportClick(eventEl, occurrence) {
  if (!isSportEvent(occurrence.sourceEvent)) return;
  eventEl.classList.add('event--sport');
  let timer = null;
  eventEl.addEventListener('click', (clickEvent) => {
    if (clickEvent.target.closest('.delete-event, .resize-handle')) return;
    clearTimeout(timer);
    // Délai pour laisser le double-clic ouvrir la fenêtre de modification.
    timer = setTimeout(() => openSportFromCalendar(occurrence), SPORT_CLICK_DELAY_MS);
  });
  eventEl.addEventListener('dblclick', () => clearTimeout(timer));
}

/* ── Rendu ─────────────────────────────────────────────────── */

function sportEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function sportInput(type, value, onInput, attributes = {}) {
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
  if (type !== 'textarea') input.type = type;
  input.value = value === undefined || value === null ? '' : value;
  Object.entries(attributes).forEach(([key, val]) => input.setAttribute(key, val));
  input.addEventListener('input', () => onInput(input.value, input));
  return input;
}

function renderSportList() {
  const list = document.getElementById('sport-session-list');
  if (!list) return;
  list.innerHTML = '';
  if (appData.sport.sessions.length === 0) {
    list.appendChild(sportEl('li', 'sport-empty', t('sport.emptyList')));
    return;
  }
  appData.sport.sessions.forEach((session) => {
    const item = sportEl('li');
    const button = sportEl('button', 'sport-session-item');
    button.type = 'button';
    if (session.id === appData.sport.activeSessionId) button.classList.add('active');
    button.appendChild(sportEl('strong', '', session.name || t('sport.newSessionName')));
    const days = getSessionWeekdays(session.id);
    button.appendChild(
      sportEl('small', '', days.length ? days.map((day) => weekdayName(day, 'short')).join(' · ') : t('sport.notScheduled'))
    );
    button.addEventListener('click', () => {
      appData.sport.activeSessionId = session.id;
      sportPickerEvent = null;
      saveData();
      renderSport();
    });
    item.appendChild(button);
    list.appendChild(item);
  });
}

function renderSportPicker(main) {
  const box = sportEl('div', 'sport-card');
  box.appendChild(sportEl('p', '', t('sport.pickSession')));
  const choices = sportEl('div', 'sport-picker');
  appData.sport.sessions.forEach((session) => {
    const button = sportEl('button', '', session.name || t('sport.newSessionName'));
    button.type = 'button';
    button.addEventListener('click', () => {
      sportPickerEvent.sportSessionId = session.id;
      appData.sport.activeSessionId = session.id;
      sportPickerEvent = null;
      saveData();
      renderSport();
    });
    choices.appendChild(button);
  });
  box.appendChild(choices);
  main.appendChild(box);
}

function renderSportMain() {
  const main = document.getElementById('sport-main');
  if (!main) return;
  main.innerHTML = '';

  const date = sportSelectedDate || new Date(new Date().setHours(0, 0, 0, 0));
  const dateKey = sportDateKey(date);

  // En-tête : navigation par jour
  const header = sportEl('div', 'sport-date-nav');
  const prev = sportEl('button', '', '◀');
  prev.type = 'button';
  prev.title = t('sport.prevDay');
  const next = sportEl('button', '', '▶');
  next.type = 'button';
  next.title = t('sport.nextDay');
  const todayBtn = sportEl('button', 'btn-secondary', t('sport.today'));
  todayBtn.type = 'button';
  const shift = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    sportSelectedDate = d;
    sportPickerEvent = null;
    selectSessionForDate(d);
    renderSport();
  };
  prev.addEventListener('click', () => shift(-1));
  next.addEventListener('click', () => shift(1));
  todayBtn.addEventListener('click', () => {
    sportSelectedDate = null;
    sportPickerEvent = null;
    selectSessionForDate(new Date());
    renderSport();
  });
  const dateLabel = date.toLocaleDateString(getCurrentLocale(), { weekday: 'long', day: 'numeric', month: 'long' });
  header.append(prev, sportEl('h2', '', t('sport.sessionOf', { date: dateLabel })), next, todayBtn);
  main.appendChild(header);

  if (sportPickerEvent) {
    renderSportPicker(main);
    return;
  }

  const session = getSportSession(appData.sport.activeSessionId);
  if (!session) {
    main.appendChild(sportEl('p', 'hint', t('sport.noSession')));
    return;
  }

  const plannedToday = getSportOccurrencesOn(date).some((occ) => occ.sourceEvent.sportSessionId === session.id);
  const days = getSessionWeekdays(session.id);
  const status = sportEl(
    'p',
    'hint',
    plannedToday ? t('sport.plannedOn', { days: days.map((d) => weekdayName(d)).join(', ') || dateLabel }) : t('sport.notPlanned')
  );

  // Nom + description
  const card = sportEl('div', 'sport-card');
  const nameLabel = sportEl('label', 'sport-field');
  nameLabel.appendChild(sportEl('span', '', t('sport.nameLabel')));
  nameLabel.appendChild(
    sportInput('text', session.name, (value) => {
      session.name = value;
      appData.calendar.events
        .filter((event) => event.sportSessionId === session.id)
        .forEach((event) => {
          event.title = value;
        });
      saveData();
      renderSportList();
    }, { class: 'sport-name-input' })
  );
  const descLabel = sportEl('label', 'sport-field');
  descLabel.appendChild(sportEl('span', '', t('sport.descriptionLabel')));
  descLabel.appendChild(
    sportInput('textarea', session.description, (value) => {
      session.description = value;
      saveData();
    }, { rows: '5' })
  );
  card.append(nameLabel, descLabel, status);
  main.appendChild(card);

  // Exercices du jour
  const log = getSportLog(dateKey, session.id);
  const doneCount = session.exercises.filter((exercise) => log[exercise.id] && log[exercise.id].done).length;
  const exercisesCard = sportEl('div', 'sport-card');
  const progress = sportEl('div', 'sport-progress');
  const bar = sportEl('div', 'sport-progress__bar');
  bar.style.width = session.exercises.length ? `${(doneCount / session.exercises.length) * 100}%` : '0%';
  progress.appendChild(bar);
  exercisesCard.appendChild(sportEl('p', 'sport-progress__label', t('sport.progress', { done: doneCount, total: session.exercises.length })));
  exercisesCard.appendChild(progress);

  const list = sportEl('div', 'sport-exercises');
  session.exercises.forEach((exercise, index) => {
    const entry = log[exercise.id] || {};
    const row = sportEl('div', 'sport-exercise');
    if (entry.done) row.classList.add('done');

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'sport-exercise__check';
    check.checked = Boolean(entry.done);
    check.setAttribute('aria-label', exercise.name || t('sport.exercise'));
    check.addEventListener('change', () => {
      setSportLog(dateKey, session.id, exercise.id, { done: check.checked });
      renderSportMain();
    });

    const body = sportEl('div', 'sport-exercise__body');
    const top = sportEl('div', 'sport-exercise__top');
    top.appendChild(
      sportInput('text', exercise.name, (value) => {
        exercise.name = value;
        saveData();
      }, { class: 'sport-exercise__name', 'aria-label': t('sport.exercise') })
    );
    const remove = sportEl('button', 'sport-exercise__delete', '✕');
    remove.type = 'button';
    remove.title = t('sport.deleteExercise');
    remove.addEventListener('click', () => {
      session.exercises.splice(index, 1);
      saveData();
      renderSportMain();
    });
    top.appendChild(remove);

    const meta = sportEl('div', 'sport-exercise__meta');
    const metaField = (labelKey, key, type, attrs = {}) => {
      const label = sportEl('label');
      label.appendChild(sportEl('span', '', t(labelKey)));
      label.appendChild(
        sportInput(type, exercise[key], (value) => {
          exercise[key] = type === 'number' ? Number(value) || 0 : value;
          saveData();
        }, attrs)
      );
      return label;
    };
    meta.append(
      metaField('sport.sets', 'sets', 'number', { min: '1', step: '1' }),
      metaField('sport.reps', 'reps', 'text'),
      metaField('sport.rest', 'rest', 'number', { min: '0', step: '15' })
    );

    const tip = sportInput('text', exercise.tip, (value) => {
      exercise.tip = value;
      saveData();
    }, { class: 'sport-exercise__tip', placeholder: t('sport.tip'), 'aria-label': t('sport.tip') });

    const note = sportInput('text', entry.note, (value) => {
      setSportLog(dateKey, session.id, exercise.id, { note: value });
    }, { class: 'sport-exercise__note', placeholder: `${t('sport.todayNote')} : ${t('sport.todayNotePlaceholder')}`, 'aria-label': t('sport.todayNote') });

    body.append(top, meta, tip, note);
    row.append(check, body);
    list.appendChild(row);
  });
  exercisesCard.appendChild(list);

  const addExercise = sportEl('button', '', t('sport.addExercise'));
  addExercise.type = 'button';
  addExercise.addEventListener('click', () => {
    session.exercises.push({ id: uid(), name: t('sport.newExercise'), sets: 3, reps: '10', rest: 60, tip: '' });
    saveData();
    renderSportMain();
  });
  exercisesCard.appendChild(addExercise);
  main.appendChild(exercisesCard);

  // Planification hebdomadaire
  const schedule = sportEl('div', 'sport-card');
  schedule.appendChild(sportEl('h3', '', t('sport.scheduleTitle')));
  const form = sportEl('form', 'sport-schedule');
  const daySelect = document.createElement('select');
  [1, 2, 3, 4, 5, 6, 0].forEach((day) => {
    const option = sportEl('option', '', weekdayName(day));
    option.value = String(day);
    daySelect.appendChild(option);
  });
  daySelect.value = String(date.getDay());
  const timeInput = document.createElement('input');
  timeInput.type = 'time';
  timeInput.value = '18:00';
  timeInput.required = true;
  const durationInput = document.createElement('input');
  durationInput.type = 'number';
  durationInput.min = '15';
  durationInput.step = '5';
  durationInput.value = '45';
  const wrap = (labelKey, input) => {
    const label = sportEl('label');
    label.appendChild(sportEl('span', '', t(labelKey)));
    label.appendChild(input);
    return label;
  };
  const submit = sportEl('button', '', t('sport.scheduleAdd'));
  submit.type = 'submit';
  form.append(wrap('sport.scheduleDay', daySelect), wrap('sport.scheduleTime', timeInput), wrap('sport.scheduleDuration', durationInput), submit);
  form.addEventListener('submit', (submitEvent) => {
    submitEvent.preventDefault();
    addSportSessionToCalendar(session, Number(daySelect.value), timeInput.value, Number(durationInput.value) || 45);
    saveData();
    renderSport();
    showSportMessage(t('sport.scheduled'));
  });
  schedule.appendChild(form);

  const deleteSession = sportEl('button', 'sport-delete-session', t('sport.deleteSession'));
  deleteSession.type = 'button';
  deleteSession.addEventListener('click', () => {
    if (!window.confirm(t('sport.deleteSessionConfirm'))) return;
    appData.sport.sessions = appData.sport.sessions.filter((s) => s.id !== session.id);
    appData.calendar.events = appData.calendar.events.filter((event) => event.sportSessionId !== session.id);
    ensureSportData();
    saveData();
    renderSport();
    renderCalendar();
  });
  schedule.appendChild(deleteSession);
  main.appendChild(schedule);
}

function showSportMessage(text) {
  const status = document.getElementById('sport-status');
  if (!status) return;
  status.textContent = text;
  clearTimeout(showSportMessage.timer);
  showSportMessage.timer = setTimeout(() => {
    status.textContent = '';
  }, 6000);
}

function renderSport() {
  if (!document.getElementById('sport')) return;
  ensureSportData();
  renderSportList();
  renderSportMain();
}

/* ── Actions ───────────────────────────────────────────────── */

// Première date >= aujourd'hui (semaine en cours) tombant sur ce jour.
function nextDateForWeekday(weekday, fromDate = new Date()) {
  const monday = startOfWeek(fromDate);
  const date = new Date(monday);
  date.setDate(monday.getDate() + ((weekday + 6) % 7));
  return date;
}

function addSportSessionToCalendar(session, weekday, time, duration) {
  const type = getOrCreateSportType();
  const [hours, minutes] = (time || '18:00').split(':').map(Number);
  const start = nextDateForWeekday(weekday);
  start.setHours(hours || 0, minutes || 0, 0, 0);
  appData.calendar.events.push({
    id: uid(),
    title: session.name,
    start: toLocalInputValue(start),
    duration: Math.max(MIN_EVENT_DURATION, duration),
    recurrence: 'weekly',
    typeId: type.id,
    color: type.color,
    sportSessionId: session.id
  });
}

function selectSessionForDate(date) {
  const occurrences = getSportOccurrencesOn(date).filter((occ) => getSportSession(occ.sourceEvent.sportSessionId));
  if (occurrences.length) {
    appData.sport.activeSessionId = occurrences[0].sourceEvent.sportSessionId;
  }
}

function loadSportProgram() {
  ensureSportData();
  if (appData.sport.sessions.some((session) => session.template === SPORT_TEMPLATE_KEY)) {
    window.alert(t('sport.alreadyLoaded'));
    return;
  }
  if (!window.confirm(t('sport.loadConfirm'))) return;
  let firstId = null;
  SPORT_PROGRAM.forEach((template) => {
    const session = {
      id: uid(),
      template: SPORT_TEMPLATE_KEY,
      name: template.name,
      description: template.description,
      exercises: template.exercises.map(([name, sets, reps, rest, tip]) => ({ id: uid(), name, sets, reps, rest, tip }))
    };
    appData.sport.sessions.push(session);
    addSportSessionToCalendar(session, template.weekday, '18:00', 45);
    if (!firstId) firstId = session.id;
  });
  appData.sport.activeSessionId = firstId;
  selectSessionForDate(new Date());
  saveData();
  renderSport();
  renderEventTypes();
  renderCalendar();
  showSportMessage(t('sport.loaded'));
}

function initSport() {
  ensureSportData();
  document.getElementById('sport-add-session').addEventListener('click', () => {
    const session = { id: uid(), name: t('sport.newSessionName'), description: '', exercises: [] };
    appData.sport.sessions.push(session);
    appData.sport.activeSessionId = session.id;
    sportPickerEvent = null;
    saveData();
    renderSport();
    const input = document.querySelector('.sport-name-input');
    if (input) {
      input.focus();
      input.select();
    }
  });
  document.getElementById('sport-load-program').addEventListener('click', loadSportProgram);
  selectSessionForDate(new Date());
  renderSport();

  const languageSelect = document.getElementById('language-select');
  if (languageSelect) languageSelect.addEventListener('change', renderSport);
}
