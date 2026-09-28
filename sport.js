/* ═══════════════════════════════════════════════════════════
   ONGLET SPORT
   - Séances composées d'exercices (souvent liés à une « échelle »
     de progression de la bibliothèque, cf. sport-library.js)
   - Mode séance : répétitions par série, minuteur de repos,
     suggestion automatique de variante plus dure / plus facile
   - Mode modification, guide, lien avec l'agenda
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
    guide: '📖 Guide & exercices',
    newSessionName: 'Nouvelle séance',
    emptyList: 'Aucune séance. Créez-en une ou chargez le programme recommandé.',
    noSession: 'Sélectionnez ou créez une séance.',
    notPlanned: "Pas prévue ce jour-là dans l'agenda",
    plannedOn: 'Prévue : {days}',
    plannedAt: 'Aujourd’hui à {time} · {duration} min',
    notScheduled: "Pas encore dans l'agenda",
    progress: '{done}/{total} exercices faits',
    allDone: 'Séance terminée, bravo !',
    noExercises: 'Aucun exercice. Cliquez sur « Modifier » pour en ajouter.',
    instructions: 'Échauffement et consignes',
    edit: '✎ Modifier',
    editTitle: 'Modifier la séance',
    doneEditing: 'Terminé',
    nameLabel: 'Nom de la séance',
    descriptionLabel: 'Échauffement / consignes',
    exercisesTitle: 'Exercices',
    exercise: 'Exercice',
    variant: 'Exercice de la bibliothèque',
    customExercise: 'Personnalisé',
    sets: 'Séries',
    reps: 'Répétitions',
    rest: 'Repos (s)',
    tip: 'Consigne',
    setsReps: '{sets} séries × {reps}',
    restShort: 'repos {rest}',
    setLabel: 'Série {n}',
    lastTime: 'Dernière fois ({date}) : {values}',
    todayNote: 'Note du jour',
    todayNotePlaceholder: 'Note (ressenti, variante…)',
    restTimer: '⏱ {rest}',
    timerRunning: 'Repos',
    timerDone: 'Repos terminé : série suivante !',
    timerStop: 'Passer',
    howTo: 'Technique',
    howToTitle: 'Comment faire',
    mistakes: 'Erreurs à éviter',
    ladder: 'Progression',
    muscles: 'Muscles : {muscles}',
    current: 'actuel',
    useVariant: 'Choisir',
    suggestUp: 'Bravo, tu as atteint {max} partout. Passe à : {name}',
    suggestUpTop: 'Bravo, tu as atteint {max} partout. Ajoute une série ou ralentis la descente (3 s).',
    suggestDown: 'Moins de {min} sur certaines séries. Essaie plutôt : {name}',
    suggestKeep: 'Objectif : {max} sur toutes les séries, puis variante suivante.',
    switchVariant: 'Passer à cette variante',
    addExercise: 'Ajouter un exercice',
    moveUp: 'Monter',
    deleteSession: 'Supprimer la séance',
    deleteSessionConfirm: "Supprimer cette séance ? Ses créneaux dans l'agenda seront aussi supprimés.",
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
    loadConfirm: "Charger le programme recommandé ?\n\n3 séances au poids du corps (débutant, accent pecs et abdos, équilibrées avec le dos), placées lundi, mercredi et vendredi à 18:00 dans l'agenda. Vous pourrez les déplacer ensuite.",
    updateConfirm: 'Mettre à jour le programme recommandé vers la nouvelle version ?\n\nLes exercices des séances A, B et C seront remplacés (plus équilibrés, avec progression automatique). Vos créneaux dans l’agenda sont conservés.',
    upToDate: 'Programme déjà en place : séances et créneaux de l’agenda sont bons.',
    repaired: 'Programme vérifié et corrigé : {count} créneau(x) ajouté(s) dans l’agenda.',
    loaded: "Programme chargé : 3 séances ajoutées à l'agenda.",
    updated: 'Programme mis à jour.',
    guideTitle: 'Guide pour progresser seul',
    libraryTitle: 'Bibliothèque d’exercices',
    back: '← Retour à la séance',
    playVideo: 'Lire la vidéo',
    moreVideos: '▶ Autres vidéos sur YouTube',
    findVideos: '▶ Voir des vidéos sur YouTube',
    tipsProgression: 'Comment progresser',
    tipsSafety: 'Sécurité',
    tipsAbs: 'Abdos visibles',
    allowAgain: 'Réautoriser',
    exclude: '🚫 Je ne veux pas faire cet exercice',
    excludeConfirm: 'Ne plus proposer « {name} » ? Il sera remplacé par la variante la plus proche.',
    target: 'Objectif : autant ou mieux que le {date} → {values}',
    intensity: 'Chaque série : arrête-toi quand il te reste 1 à 3 répétitions propres en réserve.',
    addSet: 'Ajouter une série'
  },
  en: {
    sessionsTitle: 'Workouts',
    addSession: 'New workout',
    loadProgram: 'Recommended program',
    guide: '📖 Guide & exercises',
    newSessionName: 'New workout',
    emptyList: 'No workouts yet. Create one or load the recommended program.',
    noSession: 'Select or create a workout.',
    notPlanned: 'Not scheduled on this day',
    plannedOn: 'Scheduled: {days}',
    plannedAt: 'Today at {time} · {duration} min',
    notScheduled: 'Not in the calendar yet',
    progress: '{done}/{total} exercises done',
    allDone: 'Workout complete, well done!',
    noExercises: 'No exercises yet. Click "Edit" to add some.',
    instructions: 'Warm-up and instructions',
    edit: '✎ Edit',
    editTitle: 'Edit workout',
    doneEditing: 'Done',
    nameLabel: 'Workout name',
    descriptionLabel: 'Warm-up / instructions',
    exercisesTitle: 'Exercises',
    exercise: 'Exercise',
    variant: 'Library exercise',
    customExercise: 'Custom',
    sets: 'Sets',
    reps: 'Reps',
    rest: 'Rest (s)',
    tip: 'Tip',
    setsReps: '{sets} sets × {reps}',
    restShort: 'rest {rest}',
    setLabel: 'Set {n}',
    lastTime: 'Last time ({date}): {values}',
    todayNote: "Today's note",
    todayNotePlaceholder: 'Note (feeling, variation…)',
    restTimer: '⏱ {rest}',
    timerRunning: 'Rest',
    timerDone: 'Rest over: next set!',
    timerStop: 'Skip',
    howTo: 'Technique',
    howToTitle: 'How to',
    mistakes: 'Common mistakes',
    ladder: 'Progression',
    muscles: 'Muscles: {muscles}',
    current: 'current',
    useVariant: 'Choose',
    suggestUp: 'Well done, {max} on every set. Move to: {name}',
    suggestUpTop: 'Well done, {max} on every set. Add a set or slow down the descent (3 s).',
    suggestDown: 'Below {min} on some sets. Try: {name}',
    suggestKeep: 'Goal: {max} on every set, then the next variation.',
    switchVariant: 'Switch to this variation',
    addExercise: 'Add exercise',
    moveUp: 'Move up',
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
    loadConfirm: 'Load the recommended program?\n\n3 bodyweight workouts (beginner, chest and abs focus, balanced with back work), scheduled Monday, Wednesday and Friday at 18:00.',
    updateConfirm: 'Update the recommended program to the new version?\n\nExercises of workouts A, B and C will be replaced. Your calendar slots are kept.',
    upToDate: 'Program already in place: workouts and calendar slots are fine.',
    repaired: 'Program checked and fixed: {count} slot(s) added to the calendar.',
    loaded: 'Program loaded: 3 workouts added to the calendar.',
    updated: 'Program updated.',
    guideTitle: 'Guide to progress on your own',
    libraryTitle: 'Exercise library',
    back: '← Back to workout',
    playVideo: 'Play video',
    moreVideos: '▶ More videos on YouTube',
    findVideos: '▶ Find videos on YouTube',
    tipsProgression: 'How to progress',
    tipsSafety: 'Safety',
    tipsAbs: 'Visible abs',
    allowAgain: 'Allow again',
    exclude: '🚫 I don\'t want to do this exercise',
    excludeConfirm: 'Stop suggesting "{name}"? It will be replaced by the closest variation.',
    target: 'Goal: match or beat {date} → {values}',
    intensity: 'Every set: stop when you have 1 to 3 clean reps left in the tank.',
    addSet: 'Add a set'
  },
  vi: {
    sessionsTitle: 'Buổi tập',
    addSession: 'Buổi tập mới',
    loadProgram: 'Chương trình đề xuất',
    guide: '📖 Hướng dẫn & bài tập',
    newSessionName: 'Buổi tập mới',
    emptyList: 'Chưa có buổi tập. Hãy tạo mới hoặc tải chương trình đề xuất.',
    noSession: 'Chọn hoặc tạo một buổi tập.',
    notPlanned: 'Không có lịch vào ngày này',
    plannedOn: 'Lịch: {days}',
    plannedAt: 'Hôm nay lúc {time} · {duration} phút',
    notScheduled: 'Chưa có trong lịch',
    progress: 'Đã tập {done}/{total} bài',
    allDone: 'Hoàn thành buổi tập, tuyệt vời!',
    noExercises: 'Chưa có bài tập. Nhấn "Sửa" để thêm.',
    instructions: 'Khởi động và hướng dẫn',
    edit: '✎ Sửa',
    editTitle: 'Sửa buổi tập',
    doneEditing: 'Xong',
    nameLabel: 'Tên buổi tập',
    descriptionLabel: 'Khởi động / hướng dẫn',
    exercisesTitle: 'Bài tập',
    exercise: 'Bài tập',
    variant: 'Bài tập trong thư viện',
    customExercise: 'Tùy chỉnh',
    sets: 'Hiệp',
    reps: 'Lần',
    rest: 'Nghỉ (giây)',
    tip: 'Lưu ý',
    setsReps: '{sets} hiệp × {reps}',
    restShort: 'nghỉ {rest}',
    setLabel: 'Hiệp {n}',
    lastTime: 'Lần trước ({date}): {values}',
    todayNote: 'Ghi chú hôm nay',
    todayNotePlaceholder: 'Ghi chú (cảm nhận, biến thể…)',
    restTimer: '⏱ {rest}',
    timerRunning: 'Nghỉ',
    timerDone: 'Hết giờ nghỉ: hiệp tiếp theo!',
    timerStop: 'Bỏ qua',
    howTo: 'Kỹ thuật',
    howToTitle: 'Cách thực hiện',
    mistakes: 'Lỗi thường gặp',
    ladder: 'Tiến độ',
    muscles: 'Nhóm cơ: {muscles}',
    current: 'hiện tại',
    useVariant: 'Chọn',
    suggestUp: 'Tuyệt, đạt {max} ở mọi hiệp. Chuyển sang: {name}',
    suggestUpTop: 'Tuyệt, đạt {max} ở mọi hiệp. Thêm một hiệp hoặc hạ chậm hơn (3 giây).',
    suggestDown: 'Dưới {min} ở một số hiệp. Hãy thử: {name}',
    suggestKeep: 'Mục tiêu: {max} ở mọi hiệp, rồi chuyển biến thể tiếp theo.',
    switchVariant: 'Chuyển sang biến thể này',
    addExercise: 'Thêm bài tập',
    moveUp: 'Lên trên',
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
    loadConfirm: 'Tải chương trình đề xuất?\n\n3 buổi tập với trọng lượng cơ thể, vào thứ Hai, Tư, Sáu lúc 18:00.',
    updateConfirm: 'Cập nhật chương trình đề xuất lên phiên bản mới?\n\nCác bài tập của buổi A, B, C sẽ được thay thế. Lịch vẫn được giữ.',
    upToDate: 'Chương trình đã sẵn sàng: buổi tập và lịch đều đúng.',
    repaired: 'Đã kiểm tra và sửa chương trình: thêm {count} lịch.',
    loaded: 'Đã tải chương trình: thêm 3 buổi tập vào lịch.',
    updated: 'Đã cập nhật chương trình.',
    guideTitle: 'Hướng dẫn tự tập',
    libraryTitle: 'Thư viện bài tập',
    back: '← Quay lại buổi tập',
    playVideo: 'Phát video',
    moreVideos: '▶ Thêm video trên YouTube',
    findVideos: '▶ Tìm video trên YouTube',
    tipsProgression: 'Cách tiến bộ',
    tipsSafety: 'An toàn',
    tipsAbs: 'Cơ bụng rõ nét',
    allowAgain: 'Cho phép lại',
    exclude: '🚫 Tôi không muốn tập bài này',
    excludeConfirm: 'Không đề xuất "{name}" nữa? Bài sẽ được thay bằng biến thể gần nhất.',
    target: 'Mục tiêu: bằng hoặc hơn ngày {date} → {values}',
    intensity: 'Mỗi hiệp: dừng khi còn 1–3 lần lặp chuẩn trong sức.',
    addSet: 'Thêm một hiệp'
  }
};

const SPORT_TAB_TRANSLATIONS = { fr: 'Sport', en: 'Sport', vi: 'Thể thao' };

let sportSelectedDate = null;
let sportPickerEvent = null;
let sportView = 'workout'; // 'workout' | 'edit'
let sportOpenHelp = null; // id de l'exercice dont la fiche est ouverte
let sportTimer = null;

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
  if (!Array.isArray(appData.sport.excluded)) appData.sport.excluded = SPORT_DEFAULT_EXCLUDED.slice();
  migrerProgrammeV3();
  migrerProgrammeV4();
  appData.sport.sessions.forEach((session) => {
    if (!Array.isArray(session.exercises)) session.exercises = [];
    session.exercises.forEach(normalizeLadderExercise);
    if (session.description) {
      session.description = session.description
        .replace('10 rowings serviette faciles', '10 supermans lents')
        .replace('10 rowings sous table faciles', '10 supermans lents');
    }
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

// Dernière saisie avant la date donnée, pour la même variante de l'exercice.
function getLastPerformance(sessionId, exercise, beforeKey) {
  const keys = Object.keys(appData.sport.logs).filter((key) => key < beforeKey).sort().reverse();
  for (const key of keys) {
    const entry = appData.sport.logs[key][sessionId] && appData.sport.logs[key][sessionId][exercise.id];
    if (entry && entry.variant && entry.variant !== exercise.name) continue;
    if (entry && Array.isArray(entry.sets) && entry.sets.some((value) => Number(value) > 0)) {
      return { dateKey: key, sets: entry.sets };
    }
  }
  return null;
}

// "8–12" → {min: 8, max: 12} ; "30–45 s" → {30, 45} ; "10 / jambe" → {10, 10}
function parseRepRange(reps) {
  const text = String(reps || '');
  const range = /(\d+)\s*[–-]\s*(\d+)/.exec(text);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };
  const single = /(\d+)/.exec(text);
  return single ? { min: Number(single[1]), max: Number(single[1]) } : null;
}

function getLadderStep(exercise) {
  const ladder = exercise.ladder ? SPORT_LADDERS[exercise.ladder] : null;
  if (!ladder) return { ladder: null, step: null };
  return { ladder, step: ladder.steps[exercise.step] || null };
}

// v3 (28/09/2026) : plus de rowing sous table ni à la porte (tirage au sac à
// dos + dos au sol), et l'exercice 4 de la séance A n'est plus une deuxième
// variante de pompes classiques mais des pompes larges. Les exercices gardent
// leur identifiant : seuls ceux qui changent de nature sont remplacés.
function migrerProgrammeV3() {
  if ((appData.sport.migration || 0) >= 3) return;
  SPORT_DEFAULT_EXCLUDED.forEach((name) => {
    if (!appData.sport.excluded.includes(name)) appData.sport.excluded.push(name);
  });
  const aRemplacer = { 0: [1, 3], 1: [0], 2: [1] }; // séance -> positions modifiées
  appData.sport.sessions.forEach((session) => {
    if (session.template !== SPORT_TEMPLATE_KEY || !(session.templateVersion >= 2)) return;
    let index = Number.isInteger(session.templateIndex) ? session.templateIndex : null;
    if (index === null) {
      const parNom = SPORT_PROGRAM.findIndex((t) => t.name === session.name);
      index = parNom === -1 ? null : parNom;
    }
    const template = index !== null ? SPORT_PROGRAM[index] : null;
    if (!template) return;
    (aRemplacer[index] || []).forEach((position) => {
      const exercise = session.exercises[position];
      const cible = template.exercises[position];
      if (!exercise || !cible || !['pull', 'push'].includes(exercise.ladder)) return;
      const [ladderId, stepIndex, sets, rest] = cible;
      applyLadderStep(exercise, ladderId, stepIndex);
      exercise.sets = sets;
      exercise.rest = rest;
    });
    session.templateVersion = 3;
  });
  appData.sport.migration = 3;
}

// v4 (28/09/2026) : abdos en flexion plutôt qu'en cardio, et plus de tirage.
// A : relevés de jambes → crunch inversé ; C : Y-T-W → rowing sac à dos,
// mountain climbers → crunch. Les autres exercices gardent leur progression.
function migrerProgrammeV4() {
  if ((appData.sport.migration || 0) >= 4) return;
  const aRemplacer = { 0: { 4: 'legraise' }, 2: { 1: 'back', 5: 'climbers' } }; // séance -> position -> ancienne échelle
  appData.sport.sessions.forEach((session) => {
    if (session.template !== SPORT_TEMPLATE_KEY || session.templateVersion !== 3) return;
    const index = Number.isInteger(session.templateIndex)
      ? session.templateIndex
      : SPORT_PROGRAM.findIndex((t) => t.name === session.name);
    const template = SPORT_PROGRAM[index];
    if (!template) return;
    Object.entries(aRemplacer[index] || {}).forEach(([position, ancienne]) => {
      const exercise = session.exercises[position];
      const cible = template.exercises[position];
      if (!exercise || !cible || exercise.ladder !== ancienne) return;
      const [ladderId, stepIndex, sets, rest] = cible;
      applyLadderStep(exercise, ladderId, stepIndex);
      exercise.sets = sets;
      exercise.rest = rest;
    });
    session.templateVersion = SPORT_PROGRAM_VERSION;
  });
  appData.sport.migration = 4;
}

function isExcludedName(name) {
  return Boolean(appData.sport && Array.isArray(appData.sport.excluded) && appData.sport.excluded.includes(name));
}

// Étape autorisée la plus proche : d'abord dans la direction demandée, puis dans l'autre.
function findAllowedStep(ladderId, stepIndex, direction = 1) {
  const ladder = SPORT_LADDERS[ladderId];
  if (!ladder) return null;
  const allowed = (index) => index >= 0 && index < ladder.steps.length && !isExcludedName(ladder.steps[index].name);
  for (let i = stepIndex; i >= 0 && i < ladder.steps.length; i += direction) {
    if (allowed(i)) return i;
  }
  for (let i = stepIndex - direction; i >= 0 && i < ladder.steps.length; i -= direction) {
    if (allowed(i)) return i;
  }
  return null;
}

// Retrouve l'étape d'après le nom (robuste aux changements de bibliothèque)
// et remplace une variante exclue par la plus proche autorisée.
function normalizeLadderExercise(exercise) {
  const ladder = exercise.ladder ? SPORT_LADDERS[exercise.ladder] : null;
  if (!ladder) return;
  const byName = ladder.steps.findIndex((step) => step.name === exercise.name);
  if (byName !== -1) exercise.step = byName;
  if (!ladder.steps[exercise.step]) exercise.step = Math.min(Math.max(0, Number(exercise.step) || 0), ladder.steps.length - 1);
  if (isExcludedName(ladder.steps[exercise.step].name)) {
    const replacement = findAllowedStep(exercise.ladder, exercise.step, 1);
    if (replacement !== null) {
      applyLadderStep(exercise, exercise.ladder, replacement);
    } else if (SPORT_LADDER_FALLBACK[exercise.ladder]) {
      // Toute l'échelle est exclue : on passe à l'échelle de repli.
      const repli = SPORT_LADDER_FALLBACK[exercise.ladder];
      const etape = findAllowedStep(repli, 0, 1);
      if (etape !== null) applyLadderStep(exercise, repli, etape);
    }
  }
}

function getVideoId(ladderId, stepIndex) {
  const videos = SPORT_VIDEOS[ladderId];
  return videos && videos[stepIndex] ? videos[stepIndex] : null;
}

function applyLadderStep(exercise, ladderId, stepIndex) {
  const ladder = SPORT_LADDERS[ladderId];
  if (!ladder || !ladder.steps[stepIndex]) return;
  const step = ladder.steps[stepIndex];
  exercise.ladder = ladderId;
  exercise.step = stepIndex;
  exercise.name = step.name;
  exercise.reps = step.reps;
  exercise.tip = ladder.cue;
}

// Suggestion de progression à partir des séries saisies.
function getProgressionAdvice(exercise, sets) {
  const range = parseRepRange(exercise.reps);
  const count = Math.max(1, Number(exercise.sets) || 1);
  const values = (sets || []).slice(0, count).map(Number);
  if (!range || values.length < count || values.some((value) => !(value > 0))) {
    return range ? { kind: 'keep', text: t('sport.suggestKeep', { max: range.max }) } : null;
  }
  const { ladder } = getLadderStep(exercise);
  // Étape voisine autorisée (on saute les variantes exclues).
  const neighbour = (direction) => {
    if (!ladder) return null;
    for (let i = exercise.step + direction; i >= 0 && i < ladder.steps.length; i += direction) {
      if (!isExcludedName(ladder.steps[i].name)) return i;
    }
    return null;
  };
  if (values.every((value) => value >= range.max)) {
    const next = neighbour(1);
    return next !== null
      ? { kind: 'up', text: t('sport.suggestUp', { max: range.max, name: ladder.steps[next].name }), step: next }
      : { kind: 'top', text: t('sport.suggestUpTop', { max: range.max }) };
  }
  if (values.some((value) => value < range.min)) {
    const prev = neighbour(-1);
    if (prev !== null) return { kind: 'down', text: t('sport.suggestDown', { min: range.min, name: ladder.steps[prev].name }), step: prev };
  }
  return { kind: 'keep', text: t('sport.suggestKeep', { max: range.max }) };
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
        if (sportDateKey(new Date(occurrence.start)) === sportDateKey(day)) result.push(occurrence);
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

function formatRest(seconds) {
  const value = Number(seconds) || 0;
  if (value <= 0) return '';
  if (value < 60) return `${value} s`;
  const minutes = Math.floor(value / 60);
  const rest = value % 60;
  return rest ? `${minutes} min ${String(rest).padStart(2, '0')}` : `${minutes} min`;
}

function formatShortDate(dateKey) {
  return new Date(`${dateKey}T00:00`).toLocaleDateString(getCurrentLocale(), { weekday: 'short', day: 'numeric', month: 'short' });
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
  sportView = 'workout';
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

/* ── Minuteur de repos ─────────────────────────────────────── */

function sportBeep() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const context = new AudioCtx();
    [0, 0.25, 0.5].forEach((offset) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.2, context.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + offset + 0.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(context.currentTime + offset);
      oscillator.stop(context.currentTime + offset + 0.2);
    });
    setTimeout(() => context.close(), 1000);
  } catch (error) {
    // Son indisponible : pas grave.
  }
}

function stopRestTimer() {
  if (sportTimer) clearInterval(sportTimer.interval);
  sportTimer = null;
  const box = document.getElementById('sport-timer');
  if (box) box.hidden = true;
}

function startRestTimer(seconds, label) {
  stopRestTimer();
  let box = document.getElementById('sport-timer');
  if (!box) {
    box = sportEl('div', 'sport-timer');
    box.id = 'sport-timer';
    box.setAttribute('role', 'timer');
    document.body.appendChild(box);
  }
  box.hidden = false;
  box.innerHTML = '';
  const text = sportEl('div', 'sport-timer__text');
  const count = sportEl('div', 'sport-timer__count');
  const barWrap = sportEl('div', 'sport-timer__track');
  const bar = sportEl('div', 'sport-timer__bar');
  barWrap.appendChild(bar);
  const stop = sportEl('button', 'sport-timer__stop', t('sport.timerStop'));
  stop.type = 'button';
  stop.addEventListener('click', stopRestTimer);
  text.textContent = `${t('sport.timerRunning')} · ${label}`;
  box.append(text, count, barWrap, stop);

  const end = Date.now() + seconds * 1000;
  const tick = () => {
    const left = Math.max(0, Math.round((end - Date.now()) / 1000));
    count.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
    bar.style.width = `${(left / seconds) * 100}%`;
    if (left <= 0) {
      clearInterval(sportTimer.interval);
      text.textContent = t('sport.timerDone');
      box.classList.add('sport-timer--done');
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      sportBeep();
      setTimeout(() => {
        if (sportTimer && sportTimer.end === end) stopRestTimer();
      }, 5000);
    }
  };
  box.classList.remove('sport-timer--done');
  sportTimer = { end, interval: setInterval(tick, 250) };
  tick();
}

/* ── Rendu : helpers ───────────────────────────────────────── */

function sportEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function sportButton(className, text, onClick, title) {
  const button = sportEl('button', className, text);
  button.type = 'button';
  if (title) {
    button.title = title;
    button.setAttribute('aria-label', title);
  }
  button.addEventListener('click', onClick);
  return button;
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
      sportView = 'workout';
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
    choices.appendChild(
      sportButton('', session.name || t('sport.newSessionName'), () => {
        sportPickerEvent.sportSessionId = session.id;
        appData.sport.activeSessionId = session.id;
        sportPickerEvent = null;
        saveData();
        renderSport();
      })
    );
  });
  box.appendChild(choices);
  main.appendChild(box);
}

function renderSportHeader(main, date) {
  const header = sportEl('div', 'sport-date-nav');
  const shift = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    sportSelectedDate = d;
    sportPickerEvent = null;
    sportOpenHelp = null;
    selectSessionForDate(d);
    renderSport();
  };
  const label = date.toLocaleDateString(getCurrentLocale(), { weekday: 'long', day: 'numeric', month: 'long' });
  header.append(
    sportButton('sport-icon-btn', '‹', () => shift(-1), t('sport.prevDay')),
    sportEl('span', 'sport-date-nav__label', `${label.charAt(0).toUpperCase()}${label.slice(1)}`),
    sportButton('sport-icon-btn', '›', () => shift(1), t('sport.nextDay'))
  );
  if (sportDateKey(date) !== sportDateKey(new Date())) {
    header.appendChild(
      sportButton('sport-link-btn', t('sport.today'), () => {
        sportSelectedDate = null;
        sportPickerEvent = null;
        selectSessionForDate(new Date());
        renderSport();
      })
    );
  }
  main.appendChild(header);
}

function renderSportMain() {
  const main = document.getElementById('sport-main');
  if (!main) return;
  main.innerHTML = '';

  const date = sportSelectedDate || new Date(new Date().setHours(0, 0, 0, 0));
  renderSportHeader(main, date);

  if (sportPickerEvent) {
    renderSportPicker(main);
    return;
  }

  const session = getSportSession(appData.sport.activeSessionId);
  if (!session) {
    main.appendChild(sportEl('p', 'sport-placeholder', t('sport.noSession')));
    return;
  }

  if (sportView === 'edit') {
    renderSportEdit(main, session);
  } else {
    renderSportWorkout(main, session, date);
  }
}

/* ── Mode séance ───────────────────────────────────────────── */

// Vidéo : miniature cliquable, la vidéo YouTube (sans cookies) ne se charge qu'au clic.
function renderExerciseVideo(panel, videoId, name) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} exercice technique`)}`;
  if (videoId) {
    const frame = sportEl('div', 'sport-video');
    const play = sportEl('button', 'sport-video__play');
    play.type = 'button';
    play.setAttribute('aria-label', t('sport.playVideo'));
    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    img.alt = name;
    img.loading = 'lazy';
    play.append(img, sportEl('span', 'sport-video__icon', '▶'));
    play.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = name;
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      frame.replaceChildren(iframe);
    });
    frame.appendChild(play);
    panel.appendChild(frame);
  }
  const more = sportEl('a', 'sport-video__more', videoId ? t('sport.moreVideos') : t('sport.findVideos'));
  more.href = searchUrl;
  more.target = '_blank';
  more.rel = 'noopener noreferrer';
  panel.appendChild(more);
}

function renderTipsList(panel, titleKey, lines) {
  const details = sportEl('details', 'sport-help__tips');
  details.appendChild(sportEl('summary', '', t(titleKey)));
  const list = sportEl('ul');
  lines.forEach((line) => list.appendChild(sportEl('li', '', line)));
  details.appendChild(list);
  panel.appendChild(details);
}

function renderExerciseHelp(container, session, exercise) {
  const { ladder, step } = getLadderStep(exercise);
  const panel = sportEl('div', 'sport-help');
  if (!ladder) {
    renderExerciseVideo(panel, null, exercise.name || t('sport.exercise'));
    if (exercise.tip) panel.appendChild(sportEl('p', 'sport-help__muted', exercise.tip));
    renderTipsList(panel, 'sport.tipsProgression', SPORT_TIPS.progression);
    container.appendChild(panel);
    return;
  }

  renderExerciseVideo(panel, getVideoId(exercise.ladder, exercise.step), exercise.name);
  panel.appendChild(sportEl('p', 'sport-help__muted', t('sport.muscles', { muscles: ladder.muscles })));
  if (step) {
    panel.appendChild(sportEl('h4', '', t('sport.howToTitle')));
    const how = sportEl('ol');
    step.how.forEach((line) => how.appendChild(sportEl('li', '', line)));
    panel.appendChild(how);
    if (step.mistakes && step.mistakes.length) {
      panel.appendChild(sportEl('h4', '', t('sport.mistakes')));
      const mistakes = sportEl('ul', 'sport-help__mistakes');
      step.mistakes.forEach((line) => mistakes.appendChild(sportEl('li', '', line)));
      panel.appendChild(mistakes);
    }
  }

  panel.appendChild(sportEl('h4', '', t('sport.ladder')));
  const steps = sportEl('ol', 'sport-ladder');
  ladder.steps.forEach((ladderStep, index) => {
    const excluded = isExcludedName(ladderStep.name);
    const item = sportEl('li', index === exercise.step ? 'current' : excluded ? 'excluded' : '');
    item.appendChild(sportEl('span', 'sport-ladder__name', `${ladderStep.name} · ${ladderStep.reps}`));
    if (index === exercise.step) {
      item.appendChild(sportEl('span', 'sport-ladder__badge', t('sport.current')));
    } else if (excluded) {
      item.appendChild(
        sportButton('sport-link-btn', t('sport.allowAgain'), () => {
          appData.sport.excluded = appData.sport.excluded.filter((name) => name !== ladderStep.name);
          saveData();
          renderSportMain();
        })
      );
    } else {
      item.appendChild(
        sportButton('sport-link-btn', t('sport.useVariant'), () => {
          applyLadderStep(exercise, exercise.ladder, index);
          saveData();
          renderSportMain();
        })
      );
    }
    steps.appendChild(item);
  });
  panel.appendChild(steps);
  if (ladder.note) panel.appendChild(sportEl('p', 'sport-help__muted', ladder.note));

  renderTipsList(panel, 'sport.tipsProgression', SPORT_TIPS.progression);
  renderTipsList(panel, 'sport.tipsSafety', SPORT_TIPS.safety);
  if (/abdo/i.test(ladder.muscles)) renderTipsList(panel, 'sport.tipsAbs', SPORT_TIPS.abs);

  const exclude = sportButton('sport-exclude-btn', t('sport.exclude'), () => {
    if (!window.confirm(t('sport.excludeConfirm', { name: exercise.name }))) return;
    appData.sport.excluded = Array.from(new Set([...appData.sport.excluded, exercise.name]));
    // Remplace l'exercice partout où il est utilisé.
    appData.sport.sessions.forEach((s) => s.exercises.forEach(normalizeLadderExercise));
    saveData();
    renderSportMain();
  });
  panel.appendChild(exclude);
  container.appendChild(panel);
}

function updateSportProgress(session, dateKey) {
  const log = getSportLog(dateKey, session.id);
  const total = session.exercises.length;
  const done = session.exercises.filter((exercise) => log[exercise.id] && log[exercise.id].done).length;
  const bar = document.getElementById('sport-progress-bar');
  const label = document.getElementById('sport-progress-label');
  if (bar) bar.style.width = total ? `${(done / total) * 100}%` : '0%';
  if (label) label.textContent = done === total && total > 0 ? t('sport.allDone') : t('sport.progress', { done, total });
}

function renderSportWorkout(main, session, date) {
  const dateKey = sportDateKey(date);
  const log = getSportLog(dateKey, session.id);

  const card = sportEl('div', 'sport-card sport-hero');
  const titleRow = sportEl('div', 'sport-hero__top');
  const titleBlock = sportEl('div');
  titleBlock.appendChild(sportEl('h2', 'sport-hero__title', session.name || t('sport.newSessionName')));
  const plannedToday = getSportOccurrencesOn(date).find((occ) => occ.sourceEvent.sportSessionId === session.id);
  const days = getSessionWeekdays(session.id);
  let subtitle;
  if (plannedToday) {
    subtitle = t('sport.plannedAt', { time: formatTime(new Date(plannedToday.start)), duration: plannedToday.duration });
  } else if (days.length) {
    subtitle = `${t('sport.notPlanned')} · ${t('sport.plannedOn', { days: days.map((d) => weekdayName(d)).join(', ') })}`;
  } else {
    subtitle = t('sport.notScheduled');
  }
  titleBlock.appendChild(sportEl('p', 'sport-hero__subtitle', subtitle));
  titleRow.append(
    titleBlock,
    sportButton('sport-edit-btn', t('sport.edit'), () => {
      sportView = 'edit';
      renderSportMain();
    })
  );
  card.appendChild(titleRow);

  const progress = sportEl('div', 'sport-progress');
  const bar = sportEl('div', 'sport-progress__bar');
  bar.id = 'sport-progress-bar';
  progress.appendChild(bar);
  const progressLabel = sportEl('p', 'sport-progress__label');
  progressLabel.id = 'sport-progress-label';
  card.append(progress, progressLabel);
  card.appendChild(sportEl('p', 'sport-hero__intensity', t('sport.intensity')));

  if (session.description) {
    const details = sportEl('details', 'sport-instructions');
    details.appendChild(sportEl('summary', '', t('sport.instructions')));
    details.appendChild(sportEl('p', '', session.description));
    card.appendChild(details);
  }
  main.appendChild(card);

  if (session.exercises.length === 0) {
    main.appendChild(sportEl('p', 'sport-placeholder', t('sport.noExercises')));
    return;
  }

  const list = sportEl('ol', 'sport-workout');
  session.exercises.forEach((exercise, index) => {
    const entry = log[exercise.id] || {};
    const item = sportEl('li', 'sport-workout__item');
    if (entry.done) item.classList.add('done');
    const setCount = Math.max(1, Number(exercise.sets) || 1);

    const check = sportEl('button', 'sport-check', entry.done ? '✓' : String(index + 1));
    check.type = 'button';
    check.setAttribute('aria-pressed', entry.done ? 'true' : 'false');
    check.setAttribute('aria-label', exercise.name || t('sport.exercise'));
    const setDone = (done) => {
      setSportLog(dateKey, session.id, exercise.id, { done });
      item.classList.toggle('done', done);
      check.textContent = done ? '✓' : String(index + 1);
      check.setAttribute('aria-pressed', done ? 'true' : 'false');
      updateSportProgress(session, dateKey);
    };
    check.addEventListener('click', () => setDone(!item.classList.contains('done')));

    const body = sportEl('div', 'sport-workout__body');
    const head = sportEl('div', 'sport-workout__head');
    head.appendChild(sportEl('div', 'sport-workout__name', exercise.name || t('sport.exercise')));
    head.appendChild(
      sportButton(`sport-help-btn${sportOpenHelp === exercise.id ? ' active' : ''}`, '?', () => {
        sportOpenHelp = sportOpenHelp === exercise.id ? null : exercise.id;
        renderSportMain();
      }, t('sport.howTo'))
    );
    body.appendChild(head);

    const parts = [t('sport.setsReps', { sets: setCount, reps: exercise.reps || '—' })];
    const restText = formatRest(exercise.rest);
    if (restText) parts.push(t('sport.restShort', { rest: restText }));
    body.appendChild(sportEl('div', 'sport-workout__meta', parts.join(' · ')));
    if (exercise.tip) body.appendChild(sportEl('div', 'sport-workout__tip', exercise.tip));

    if (sportOpenHelp === exercise.id) renderExerciseHelp(body, session, exercise);

    // Objectif : autant ou mieux que la dernière fois, série par série.
    const last = getLastPerformance(session.id, exercise, dateKey);
    const lastSets = last ? last.sets.map(Number).filter((value) => value > 0) : [];
    const targetCount = Math.max(setCount, lastSets.length);
    if (lastSets.length) {
      body.appendChild(
        sportEl('div', 'sport-workout__target', t('sport.target', {
          date: formatShortDate(last.dateKey),
          values: lastSets.join(' · '),
          count: lastSets.length
        }))
      );
    }

    // Saisie série par série
    const setsRow = sportEl('div', 'sport-sets');
    const values = Array.isArray(entry.sets) ? entry.sets.slice() : [];
    // Les séries du jour ne comptent pour la suggestion que si elles ont été
    // faites sur la variante actuelle (sinon on vient de changer de variante).
    let sameVariant = !entry.variant || entry.variant === exercise.name;
    const adviceBox = sportEl('div', 'sport-advice-slot');
    const renderAdvice = () => {
      adviceBox.innerHTML = '';
      const hasToday = values.some((value) => Number(value) > 0);
      const source = hasToday ? (sameVariant ? values : null) : last ? last.sets : null;
      const advice = source ? getProgressionAdvice(exercise, source) : null;
      if (!advice || advice.kind === 'keep') return;
      const banner = sportEl('div', `sport-advice sport-advice--${advice.kind}`);
      banner.appendChild(sportEl('span', '', advice.text));
      if (typeof advice.step === 'number') {
        banner.appendChild(
          sportButton('sport-advice__btn', t('sport.switchVariant'), () => {
            applyLadderStep(exercise, exercise.ladder, advice.step);
            saveData();
            renderSportMain();
          })
        );
      }
      adviceBox.appendChild(banner);
    };
    const colorInput = (input, index) => {
      const target = lastSets[index];
      const value = Number(input.value);
      input.classList.toggle('reached', Boolean(target) && value >= target);
      input.classList.toggle('below', Boolean(target) && value > 0 && value < target);
    };
    const inputs = [];
    const addSetInput = (i) => {
      const input = sportInput('number', values[i], (value) => {
        values[i] = value === '' ? '' : Number(value);
        sameVariant = true;
        colorInput(input, i);
        const filled = values.filter((v) => Number(v) > 0).length;
        const patch = { sets: values.slice(), variant: exercise.name };
        if (filled >= setCount && !item.classList.contains('done')) patch.done = true;
        setSportLog(dateKey, session.id, exercise.id, patch);
        if (patch.done) {
          item.classList.add('done');
          check.textContent = '✓';
          updateSportProgress(session, dateKey);
        }
        renderAdvice();
      }, {
        class: 'sport-set',
        min: '0',
        inputmode: 'numeric',
        'aria-label': t('sport.setLabel', { n: i + 1 }),
        placeholder: lastSets[i] ? String(lastSets[i]) : `S${i + 1}`
      });
      colorInput(input, i);
      inputs.push(input);
      setsRow.insertBefore(input, addSetButton);
    };
    // Bouton « + série » : une série de plus que prévu, retenue comme objectif la prochaine fois.
    const addSetButton = sportButton('sport-add-set', '+', () => {
      addSetInput(inputs.length);
      inputs[inputs.length - 1].focus();
    }, t('sport.addSet'));
    setsRow.appendChild(addSetButton);
    const initialCount = Math.max(targetCount, values.length);
    for (let i = 0; i < initialCount; i += 1) addSetInput(i);
    if (Number(exercise.rest) > 0) {
      setsRow.appendChild(
        sportButton('sport-rest-btn', t('sport.restTimer', { rest: formatRest(exercise.rest) }), () => {
          startRestTimer(Number(exercise.rest), exercise.name || t('sport.exercise'));
        })
      );
    }
    body.appendChild(setsRow);
    body.appendChild(adviceBox);
    renderAdvice();

    body.appendChild(
      sportInput('text', entry.note, (value) => {
        setSportLog(dateKey, session.id, exercise.id, { note: value });
      }, { class: 'sport-workout__note', placeholder: t('sport.todayNotePlaceholder'), 'aria-label': t('sport.todayNote') })
    );

    item.append(check, body);
    list.appendChild(item);
  });
  main.appendChild(list);
  updateSportProgress(session, dateKey);
}

/* ── Mode modification ─────────────────────────────────────── */

function buildVariantSelect(exercise, onChange) {
  const select = document.createElement('select');
  const custom = sportEl('option', '', t('sport.customExercise'));
  custom.value = '';
  select.appendChild(custom);
  Object.entries(SPORT_LADDERS).forEach(([ladderId, ladder]) => {
    const group = document.createElement('optgroup');
    group.label = ladder.name;
    ladder.steps.forEach((step, index) => {
      const option = sportEl('option', '', isExcludedName(step.name) ? `🚫 ${step.name}` : step.name);
      option.value = `${ladderId}:${index}`;
      group.appendChild(option);
    });
    select.appendChild(group);
  });
  select.value = exercise.ladder && SPORT_LADDERS[exercise.ladder] ? `${exercise.ladder}:${exercise.step}` : '';
  select.addEventListener('change', () => onChange(select.value));
  return select;
}

function renderSportEdit(main, session) {
  const card = sportEl('div', 'sport-card');
  const top = sportEl('div', 'sport-hero__top');
  top.appendChild(sportEl('h2', 'sport-hero__title', t('sport.editTitle')));
  top.appendChild(
    sportButton('', t('sport.doneEditing'), () => {
      sportView = 'workout';
      renderSportMain();
    })
  );
  card.appendChild(top);

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
    }, { rows: '4' })
  );
  card.append(nameLabel, descLabel);
  main.appendChild(card);

  const exercisesCard = sportEl('div', 'sport-card');
  exercisesCard.appendChild(sportEl('h3', '', t('sport.exercisesTitle')));
  const list = sportEl('div', 'sport-edit-list');
  session.exercises.forEach((exercise, index) => {
    const row = sportEl('div', 'sport-edit-row');
    const head = sportEl('div', 'sport-edit-row__head');
    head.appendChild(sportEl('span', 'sport-edit-row__index', String(index + 1)));
    const nameInput = sportInput('text', exercise.name, (value) => {
      exercise.name = value;
      saveData();
    }, { class: 'sport-edit-row__name', 'aria-label': t('sport.exercise'), placeholder: t('sport.exercise') });
    head.appendChild(nameInput);
    const moveUp = sportButton('sport-icon-btn sport-icon-btn--ghost', '↑', () => {
      session.exercises.splice(index - 1, 0, session.exercises.splice(index, 1)[0]);
      saveData();
      renderSportMain();
    }, t('sport.moveUp'));
    moveUp.disabled = index === 0;
    head.append(
      moveUp,
      sportButton('sport-icon-btn sport-icon-btn--ghost', '✕', () => {
        session.exercises.splice(index, 1);
        saveData();
        renderSportMain();
      }, t('sport.deleteExercise'))
    );

    const variantLabel = sportEl('label', 'sport-edit-row__variant');
    variantLabel.appendChild(sportEl('span', '', t('sport.variant')));
    variantLabel.appendChild(
      buildVariantSelect(exercise, (value) => {
        if (!value) {
          delete exercise.ladder;
          delete exercise.step;
        } else {
          const [ladderId, stepIndex] = value.split(':');
          applyLadderStep(exercise, ladderId, Number(stepIndex));
        }
        saveData();
        renderSportMain();
      })
    );

    const meta = sportEl('div', 'sport-edit-row__meta');
    const field = (labelKey, key, type, attrs = {}) => {
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
      field('sport.sets', 'sets', 'number', { min: '1', step: '1' }),
      field('sport.reps', 'reps', 'text'),
      field('sport.rest', 'rest', 'number', { min: '0', step: '15' })
    );
    const tipLabel = sportEl('label', 'sport-edit-row__tip');
    tipLabel.appendChild(sportEl('span', '', t('sport.tip')));
    tipLabel.appendChild(
      sportInput('text', exercise.tip, (value) => {
        exercise.tip = value;
        saveData();
      })
    );
    row.append(head, variantLabel, meta, tipLabel);
    list.appendChild(row);
  });
  exercisesCard.appendChild(list);
  exercisesCard.appendChild(
    sportButton('sport-add-btn', `+ ${t('sport.addExercise')}`, () => {
      session.exercises.push({ id: uid(), name: '', sets: 3, reps: '8–12', rest: 60, tip: '' });
      saveData();
      renderSportMain();
      const inputs = document.querySelectorAll('.sport-edit-row__name');
      if (inputs.length) inputs[inputs.length - 1].focus();
    })
  );
  main.appendChild(exercisesCard);

  const schedule = sportEl('div', 'sport-card');
  schedule.appendChild(sportEl('h3', '', t('sport.scheduleTitle')));
  const days = getSessionWeekdays(session.id);
  schedule.appendChild(
    sportEl('p', 'sport-hint', days.length ? t('sport.plannedOn', { days: days.map((d) => weekdayName(d)).join(', ') }) : t('sport.notScheduled'))
  );
  const form = sportEl('form', 'sport-schedule');
  const daySelect = document.createElement('select');
  [1, 2, 3, 4, 5, 6, 0].forEach((day) => {
    const option = sportEl('option', '', weekdayName(day));
    option.value = String(day);
    daySelect.appendChild(option);
  });
  daySelect.value = String((sportSelectedDate || new Date()).getDay());
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
  main.appendChild(schedule);

  const danger = sportEl('div', 'sport-danger');
  danger.appendChild(
    sportButton('sport-delete-session', t('sport.deleteSession'), () => {
      if (!window.confirm(t('sport.deleteSessionConfirm'))) return;
      appData.sport.sessions = appData.sport.sessions.filter((s) => s.id !== session.id);
      appData.calendar.events = appData.calendar.events.filter((event) => event.sportSessionId !== session.id);
      sportView = 'workout';
      ensureSportData();
      saveData();
      renderSport();
      renderCalendar();
    })
  );
  main.appendChild(danger);
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

// Première date, à partir d'aujourd'hui, qui tombe sur ce jour de la semaine.
function nextDateForWeekday(weekday, fromDate = new Date()) {
  const date = new Date(fromDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + ((weekday - date.getDay() + 7) % 7));
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

function buildProgramExercises(template) {
  return template.exercises.map(([ladderId, stepIndex, sets, rest]) => {
    const exercise = { id: uid(), sets, rest };
    applyLadderStep(exercise, ladderId, stepIndex);
    normalizeLadderExercise(exercise);
    return exercise;
  });
}

// Associe chaque séance du programme à une séance existante (si elle existe).
function matchProgramSessions() {
  const existing = appData.sport.sessions.filter((session) => session.template === SPORT_TEMPLATE_KEY);
  const used = new Set();
  const take = (session) => {
    if (session) used.add(session.id);
    return session || null;
  };
  const byIndex = SPORT_PROGRAM.map((template, index) =>
    take(existing.find((session) => session.templateIndex === index && !used.has(session.id)))
  );
  return byIndex.map((found, index) => {
    if (found) return found;
    const template = SPORT_PROGRAM[index];
    return (
      take(existing.find((session) => !used.has(session.id) && session.templateIndex === undefined && session.name === template.name)) ||
      take(existing.find((session) => !used.has(session.id) && session.templateIndex === undefined))
    );
  });
}

// Charge, met à jour ou répare le programme recommandé :
// 3 séances bien nommées + un créneau hebdomadaire chacune au bon jour.
function loadSportProgram() {
  ensureSportData();
  const matches = matchProgramSessions();
  const isNew = matches.every((session) => !session);
  const isOutdated = matches.some((session) => session && !(session.templateVersion >= SPORT_PROGRAM_VERSION));
  if (isNew && !window.confirm(t('sport.loadConfirm'))) return;
  if (!isNew && isOutdated && !window.confirm(t('sport.updateConfirm'))) return;

  const type = getOrCreateSportType();
  let addedSlots = 0;
  let fixed = 0;
  SPORT_PROGRAM.forEach((template, index) => {
    let session = matches[index];
    if (!session) {
      session = { id: uid(), template: SPORT_TEMPLATE_KEY, exercises: buildProgramExercises(template) };
      appData.sport.sessions.push(session);
      fixed += 1;
    } else if (!(session.templateVersion >= SPORT_PROGRAM_VERSION)) {
      session.exercises = buildProgramExercises(template);
      fixed += 1;
    }
    if (session.name !== template.name) fixed += 1;
    session.name = template.name;
    session.templateIndex = index;
    session.templateVersion = SPORT_PROGRAM_VERSION;
    if (!session.description) session.description = template.description;
    if (isOutdated || isNew) session.description = template.description;

    // Créneaux : titre et type corrects, et au moins un créneau hebdo au bon jour.
    const linked = appData.calendar.events.filter((event) => event.sportSessionId === session.id);
    linked.forEach((event) => {
      if (event.title !== template.name || event.typeId !== type.id) fixed += 1;
      event.title = template.name;
      event.typeId = type.id;
      event.color = type.color;
    });
    const hasSlot = linked.some(
      (event) => event.recurrence === 'weekly' && new Date(event.start).getDay() === template.weekday && !event.until
    );
    if (!hasSlot) {
      addSportSessionToCalendar(session, template.weekday, '18:00', 45);
      addedSlots += 1;
    }
  });

  // Garde les séances du programme dans l'ordre A, B, C en tête de liste.
  appData.sport.sessions.sort((a, b) => {
    const ia = a.template === SPORT_TEMPLATE_KEY ? a.templateIndex : 99;
    const ib = b.template === SPORT_TEMPLATE_KEY ? b.templateIndex : 99;
    return ia - ib;
  });

  if (!appData.sport.sessions.some((session) => session.id === appData.sport.activeSessionId)) {
    appData.sport.activeSessionId = appData.sport.sessions[0].id;
  }
  selectSessionForDate(sportSelectedDate || new Date());
  sportView = 'workout';
  saveData();
  renderSport();
  renderEventTypes();
  renderCalendar();

  if (isNew) {
    showSportMessage(t('sport.loaded'));
  } else if (isOutdated) {
    showSportMessage(t('sport.updated'));
  } else if (addedSlots || fixed) {
    showSportMessage(t('sport.repaired', { count: addedSlots }));
  } else {
    showSportMessage(t('sport.upToDate'));
  }
}

function initSport() {
  ensureSportData();
  document.getElementById('sport-add-session').addEventListener('click', () => {
    const session = { id: uid(), name: t('sport.newSessionName'), description: '', exercises: [] };
    appData.sport.sessions.push(session);
    appData.sport.activeSessionId = session.id;
    sportPickerEvent = null;
    sportView = 'edit';
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
