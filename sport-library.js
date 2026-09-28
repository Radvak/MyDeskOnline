/* ═══════════════════════════════════════════════════════════
   BIBLIOTHÈQUE D'EXERCICES AU POIDS DU CORPS
   Chaque « échelle » va de la variante la plus facile à la plus
   difficile. Règle de progression : quand toutes les séries
   atteignent le haut de la fourchette, on passe à l'étape
   suivante ; si on n'atteint pas le bas, on redescend.
   ═══════════════════════════════════════════════════════════ */

const SPORT_LADDERS = {
  push: {
    name: 'Pompes',
    muscles: 'Pecs, triceps, avant des épaules',
    cue: 'Corps gainé, coudes à ~45°, poitrine près du sol.',
    steps: [
      {
        name: 'Pompes contre un mur',
        reps: '10–15',
        how: [
          'Debout face au mur, mains à hauteur de poitrine, un peu plus larges que les épaules.',
          'Recule les pieds pour que le corps soit incliné et bien droit.',
          'Approche la poitrine du mur en pliant les bras, coudes à ~45° du buste, puis pousse.'
        ],
        mistakes: ['Hanches qui cassent vers l’avant.', 'Coudes écartés à 90° (mauvais pour les épaules).']
      },
      {
        name: 'Pompes inclinées (mains sur une table)',
        reps: '8–12',
        how: [
          'Mains sur une surface stable à hauteur de hanches (table, plan de travail).',
          'Corps gainé de la tête aux talons : serre abdos et fessiers.',
          'Descends jusqu’à ce que la poitrine frôle le bord, remonte bras tendus.',
          'Plus la surface est basse, plus c’est difficile.'
        ],
        mistakes: ['Bassin qui s’affaisse.', 'Descendre à moitié.']
      },
      {
        name: 'Pompes sur les genoux',
        reps: '8–12',
        how: [
          'Genoux au sol, mains un peu plus larges que les épaules.',
          'Épaules, hanches et genoux alignés (pas les fesses en l’air).',
          'Descends en 2 secondes jusqu’à 2–3 cm du sol, remonte en poussant fort.'
        ],
        mistakes: ['Fesses en l’air.', 'Tête qui tombe vers le sol.']
      },
      {
        name: 'Pompes classiques',
        reps: '8–12',
        how: [
          'Appui sur les mains et la pointe des pieds, corps droit comme une planche.',
          'Serre les abdos et les fessiers pendant tout le mouvement.',
          'Descends en 2 secondes jusqu’à ce que la poitrine frôle le sol, coudes à ~45°.',
          'Remonte jusqu’à avoir les bras tendus.'
        ],
        mistakes: ['Bassin qui tombe ou qui monte.', 'Demi-amplitude.', 'Coudes écartés à 90°.']
      },
      {
        name: 'Pompes pieds surélevés',
        reps: '8–12',
        how: [
          'Pieds sur une chaise ou un canapé, mains au sol.',
          'Même technique que les pompes classiques.',
          'Travaille davantage le haut des pecs. Plus les pieds sont hauts, plus c’est dur.'
        ],
        mistakes: ['Cambrer le bas du dos.']
      },
      {
        name: 'Pompes archer',
        reps: '5–8 / côté',
        how: [
          'Mains très écartées au sol.',
          'Descends vers une main en gardant l’autre bras presque tendu.',
          'Remonte, puis alterne de côté.'
        ],
        mistakes: ['Tourner les hanches.', 'Aller trop vite.']
      }
    ]
  },
  wide: {
    name: 'Pompes larges',
    muscles: 'Pecs (surtout), avant des épaules',
    cue: 'Mains ~1,5× la largeur des épaules, épaules basses, amplitude complète.',
    steps: [
      {
        name: 'Pompes larges sur les genoux',
        reps: '8–12',
        how: [
          'Genoux au sol, mains environ 1,5 fois plus écartées que les épaules.',
          'Corps aligné des épaules aux genoux.',
          'Descends lentement, la poitrine entre les mains.'
        ],
        mistakes: ['Épaules qui remontent vers les oreilles.']
      },
      {
        name: 'Pompes larges',
        reps: '8–12',
        how: [
          'Position de pompe classique, mains ~1,5× la largeur des épaules.',
          'Coudes au-dessus des poignets en bas du mouvement.',
          'Amplitude complète, 2 secondes à la descente.'
        ],
        mistakes: ['Douleur à l’avant de l’épaule : resserre un peu les mains.']
      },
      {
        name: 'Pompes larges pieds surélevés',
        reps: '8–12',
        how: ['Pieds sur une chaise, mains larges.', 'Cible le haut et l’extérieur des pecs.'],
        mistakes: ['Cambrer le dos.']
      }
    ]
  },
  close: {
    name: 'Pompes serrées',
    muscles: 'Triceps, intérieur des pecs',
    cue: 'Mains sous les épaules, coudes qui frôlent le buste.',
    steps: [
      {
        name: 'Pompes serrées inclinées (mains sur une table)',
        reps: '8–12',
        how: ['Mains écartées de la largeur des épaules sur une table stable.', 'Coudes le long du corps en descendant.'],
        mistakes: ['Coudes qui s’écartent.']
      },
      {
        name: 'Pompes serrées sur les genoux',
        reps: '8–12',
        how: ['Genoux au sol, mains sous les épaules.', 'Coudes qui frôlent le buste.'],
        mistakes: ['Coudes qui s’écartent.']
      },
      {
        name: 'Pompes serrées',
        reps: '8–12',
        how: ['Position de pompe, mains sous les épaules.', 'Coudes collés au corps, descente lente.'],
        mistakes: ['Bassin qui tombe.']
      },
      {
        name: 'Pompes diamant',
        reps: '6–10',
        how: ['Pouces et index se touchent en formant un losange sous le sternum.', 'Coudes vers l’arrière, pas sur les côtés.'],
        mistakes: ['Douleur aux poignets : reviens aux pompes serrées.']
      }
    ]
  },
  pull: {
    name: 'Rowing (tirage)',
    muscles: 'Dos, arrière des épaules, biceps',
    cue: 'Tire la poitrine vers l’appui, serre les omoplates, redescends lentement.',
    note: 'Étape suivante idéale : une barre de traction de porte (≈ 20–30 €) pour les tractions.',
    steps: [
      {
        name: 'Rowing serviette à la porte',
        reps: '10–15',
        how: [
          'Passe une serviette solide autour des deux poignées d’une porte FERMÉE.',
          'Place-toi du côté vers lequel la porte se ferme (tu tires pour la fermer, jamais pour l’ouvrir).',
          'Pieds près de la porte, penche-toi en arrière bras tendus.',
          'Tire en serrant les omoplates, coudes le long du corps. Plus tes pieds sont proches de la porte, plus c’est dur.'
        ],
        mistakes: ['Poignée fragile : vérifie-la avant.', 'Tirer avec les bras seulement, sans serrer les omoplates.']
      },
      {
        name: 'Rowing inversé sous une table, genoux fléchis',
        reps: '8–12',
        how: [
          'Allonge-toi sous une table LOURDE et stable, mains au bord, écartées de la largeur des épaules.',
          'Pieds au sol, genoux fléchis, corps gainé.',
          'Tire la poitrine vers la table, puis redescends en 2 secondes.'
        ],
        mistakes: ['Table qui bascule : teste-la d’abord en tirant doucement.', 'Hanches qui tombent.']
      },
      {
        name: 'Rowing inversé sous une table, jambes tendues',
        reps: '8–12',
        how: ['Même position, jambes tendues, appui sur les talons.', 'Corps droit comme une planche.'],
        mistakes: ['Hanches qui tombent.']
      },
      {
        name: 'Rowing inversé pieds surélevés',
        reps: '8–12',
        how: ['Talons posés sur une chaise, corps horizontal.', 'Tire jusqu’à ce que la poitrine touche presque la table.'],
        mistakes: ['Demi-amplitude.']
      }
    ]
  },
  squat: {
    name: 'Squats et fentes',
    muscles: 'Cuisses, fessiers',
    cue: 'Genoux dans l’axe des pieds, talons au sol, dos droit.',
    steps: [
      {
        name: 'Squat assisté (en tenant un meuble)',
        reps: '12–20',
        how: ['Tiens-toi à un meuble stable devant toi.', 'Descends en poussant les hanches en arrière, remonte en poussant dans le sol.'],
        mistakes: ['Se tirer avec les bras.']
      },
      {
        name: 'Squat',
        reps: '15–20',
        how: [
          'Pieds largeur d’épaules, pointes légèrement ouvertes.',
          'Descends en poussant les hanches en arrière, cuisses au moins parallèles au sol.',
          'Genoux dans l’axe des pieds, talons au sol, poitrine haute.',
          'Remonte en poussant dans tout le pied.'
        ],
        mistakes: ['Genoux qui rentrent vers l’intérieur.', 'Talons qui décollent.', 'Dos qui s’arrondit.']
      },
      {
        name: 'Fente statique (split squat)',
        reps: '8–12 / jambe',
        how: [
          'Un grand pas en avant, pieds écartés de la largeur des hanches.',
          'Descends verticalement jusqu’à ce que le genou arrière frôle le sol.',
          'Remonte en poussant sur le talon avant. Fais toutes les reps d’un côté, puis change.'
        ],
        mistakes: ['Genou avant qui rentre.', 'Buste qui penche trop en avant.']
      },
      {
        name: 'Squat bulgare (pied arrière sur une chaise)',
        reps: '8–12 / jambe',
        how: ['Dessus du pied arrière posé sur une chaise.', 'Descends jusqu’à ce que la cuisse avant soit parallèle au sol.'],
        mistakes: ['Pied avant trop près de la chaise.']
      },
      {
        name: 'Squat sur une jambe vers une chaise',
        reps: '5–8 / jambe',
        how: ['Debout devant une chaise, une jambe tendue devant toi.', 'Descends lentement sur une jambe jusqu’à t’asseoir, puis remonte sans élan.'],
        mistakes: ['Se laisser tomber sur la chaise.']
      }
    ]
  },
  hinge: {
    name: 'Pont fessier',
    muscles: 'Fessiers, arrière des cuisses, bas du dos',
    cue: 'Pousse dans les talons, serre les fessiers 1 s en haut.',
    steps: [
      {
        name: 'Pont fessier',
        reps: '12–20',
        how: [
          'Allongé sur le dos, pieds à plat près des fesses.',
          'Pousse dans les talons pour monter le bassin jusqu’à aligner épaules, hanches et genoux.',
          'Serre les fessiers 1 seconde en haut, redescends lentement.'
        ],
        mistakes: ['Cambrer le bas du dos au lieu de serrer les fessiers.']
      },
      {
        name: 'Pont fessier sur une jambe',
        reps: '8–12 / jambe',
        how: ['Même mouvement, une jambe tendue en l’air.', 'Garde le bassin bien horizontal.'],
        mistakes: ['Bassin qui penche d’un côté.']
      },
      {
        name: 'Hip thrust sur une jambe (épaules sur le canapé)',
        reps: '8–12 / jambe',
        how: ['Haut du dos appuyé sur un canapé, un pied au sol.', 'Monte le bassin jusqu’à l’horizontale.'],
        mistakes: ['Hyper-cambrer en haut.']
      }
    ]
  },
  plank: {
    name: 'Planche (gainage)',
    muscles: 'Abdos profonds (sangle abdominale)',
    cue: 'Corps droit, abdos ET fessiers serrés, respire normalement.',
    steps: [
      {
        name: 'Planche sur les genoux',
        reps: '20–40 s',
        how: ['Avant-bras au sol, coudes sous les épaules, genoux au sol.', 'Corps aligné des épaules aux genoux.'],
        mistakes: ['Retenir sa respiration.']
      },
      {
        name: 'Planche',
        reps: '30–60 s',
        how: [
          'Avant-bras au sol, coudes sous les épaules, appui sur la pointe des pieds.',
          'Serre abdos et fessiers, bassin légèrement rentré.',
          'Respire normalement.'
        ],
        mistakes: ['Fesses trop hautes.', 'Bassin qui s’affaisse (douleur au bas du dos).']
      },
      {
        name: 'Planche avec touchers d’épaules',
        reps: '8–12 / côté',
        how: ['Planche bras tendus, pieds écartés.', 'Touche l’épaule opposée avec une main, sans que le bassin bouge.'],
        mistakes: ['Hanches qui se balancent.']
      }
    ]
  },
  side: {
    name: 'Planche latérale',
    muscles: 'Obliques (côtés de la taille)',
    cue: 'Coude sous l’épaule, hanches hautes, corps aligné.',
    steps: [
      {
        name: 'Planche latérale sur les genoux',
        reps: '20–30 s / côté',
        how: ['Sur le côté, coude sous l’épaule, genoux fléchis au sol.', 'Monte les hanches pour aligner épaules, hanches et genoux.'],
        mistakes: ['Hanches qui tombent.']
      },
      {
        name: 'Planche latérale',
        reps: '20–45 s / côté',
        how: ['Sur le côté, coude sous l’épaule, jambes tendues, pieds l’un sur l’autre.', 'Hanches hautes, corps droit.'],
        mistakes: ['Hanches qui tombent ou partent en arrière.']
      },
      {
        name: 'Planche latérale avec levée de jambe',
        reps: '20–30 s / côté',
        how: ['En planche latérale, lève la jambe du dessus et tiens la position.'],
        mistakes: ['Perdre l’alignement du corps.']
      }
    ]
  },
  legraise: {
    name: 'Relevés de jambes',
    muscles: 'Abdos (surtout le bas du grand droit)',
    cue: 'Bas du dos plaqué au sol, descente lente, pas d’élan.',
    steps: [
      {
        name: 'Relevés de genoux allongé',
        reps: '10–15',
        how: ['Allongé, mains sous les fesses, genoux fléchis.', 'Ramène les genoux vers la poitrine, redescends sans poser les pieds.'],
        mistakes: ['Dos qui se cambre en bas.']
      },
      {
        name: 'Relevés de jambes allongé',
        reps: '8–12',
        how: [
          'Allongé, mains sous les fesses, jambes tendues.',
          'Monte les jambes jusqu’à la verticale, redescends en 3 secondes sans toucher le sol.',
          'Le bas du dos reste collé au sol.'
        ],
        mistakes: ['Dos qui se cambre.', 'Utiliser l’élan.']
      },
      {
        name: 'Relevés de jambes + montée du bassin',
        reps: '8–12',
        how: ['Comme les relevés de jambes, puis décolle les fesses du sol en haut du mouvement.'],
        mistakes: ['Balancer les jambes.']
      }
    ]
  },
  hollow: {
    name: 'Hollow body',
    muscles: 'Abdos (tout le grand droit), gainage',
    cue: 'Bas du dos collé au sol en permanence.',
    steps: [
      {
        name: 'Dead bug',
        reps: '8–12 / côté',
        how: [
          'Sur le dos, bras tendus vers le plafond, genoux pliés à 90° au-dessus des hanches.',
          'Tends lentement un bras et la jambe opposée vers le sol, sans décoller le bas du dos.',
          'Reviens et alterne.'
        ],
        mistakes: ['Bas du dos qui décolle.', 'Aller trop vite.']
      },
      {
        name: 'Hollow body genoux fléchis',
        reps: '20–30 s',
        how: ['Sur le dos, épaules décollées, genoux ramenés, bras tendus le long du corps.', 'Bas du dos plaqué au sol.'],
        mistakes: ['Dos qui se cambre.']
      },
      {
        name: 'Hollow body hold',
        reps: '20–40 s',
        how: [
          'Bas du dos collé au sol, épaules décollées.',
          'Bras tendus derrière la tête, jambes tendues à ~30 cm du sol.',
          'Plus les bras et les jambes sont bas, plus c’est dur.'
        ],
        mistakes: ['Dos qui décolle : remonte un peu les jambes.']
      }
    ]
  },
  climbers: {
    name: 'Mountain climbers',
    muscles: 'Abdos, cardio',
    cue: 'Hanches basses, épaules au-dessus des mains.',
    steps: [
      {
        name: 'Mountain climbers lents',
        reps: '20–30 s',
        how: ['Position de pompe bras tendus.', 'Ramène un genou vers la poitrine, puis l’autre, lentement.'],
        mistakes: ['Fesses en l’air.']
      },
      {
        name: 'Mountain climbers',
        reps: '30–45 s',
        how: ['Même mouvement, rythme rapide et régulier.'],
        mistakes: ['Fesses en l’air.']
      },
      {
        name: 'Mountain climbers croisés',
        reps: '30–45 s',
        how: ['Ramène chaque genou vers le coude opposé.'],
        mistakes: ['Perdre le gainage.']
      }
    ]
  },
  crunch: {
    name: 'Crunchs',
    muscles: 'Abdos (grand droit), obliques',
    cue: 'Monte en soufflant, sans tirer sur la nuque.',
    steps: [
      {
        name: 'Crunch',
        reps: '12–20',
        how: ['Sur le dos, genoux fléchis, mains aux tempes.', 'Enroule le haut du dos en soufflant, redescends lentement.'],
        mistakes: ['Tirer sur la nuque.']
      },
      {
        name: 'Crunch vélo',
        reps: '10–15 / côté',
        how: ['Coude vers le genou opposé, l’autre jambe tendue.', 'Lentement, en contrôlant.'],
        mistakes: ['Aller trop vite.']
      }
    ]
  }
};

// Programme v2 : 3 séances full body, équilibrées pousser / tirer,
// accent pecs + abdos. [échelle, étape de départ, séries, repos en s]
const SPORT_PROGRAM_VERSION = 2;
const SPORT_PROGRAM = [
  {
    weekday: 1,
    name: 'A — Pecs & abdos',
    description:
      'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules dans chaque sens, 10 squats lents, 10 pompes faciles (contre un mur).\n' +
      'Note tes répétitions série par série : le site te dira quand passer à la variante suivante.',
    exercises: [
      ['push', 2, 4, 90],
      ['pull', 0, 3, 90],
      ['squat', 1, 3, 60],
      ['push', 1, 3, 75],
      ['legraise', 0, 3, 45],
      ['plank', 1, 3, 45]
    ]
  },
  {
    weekday: 3,
    name: 'B — Dos, jambes & gainage',
    description:
      'Échauffement (5 min) : 30 s de montées de genoux, 10 rotations de hanches, 10 squats lents, 10 rowings serviette faciles.\n' +
      'Le dos équilibre le travail des pecs : épaules en arrière, posture droite, pecs mieux mis en valeur.',
    exercises: [
      ['pull', 0, 4, 90],
      ['close', 1, 3, 75],
      ['squat', 2, 3, 60],
      ['hinge', 0, 3, 60],
      ['side', 1, 3, 45],
      ['hollow', 0, 3, 45]
    ]
  },
  {
    weekday: 5,
    name: 'C — Pecs & abdos (volume)',
    description:
      'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules, 10 pompes faciles, 10 squats.\n' +
      'Séance la plus orientée pecs de la semaine : soigne l’amplitude et la descente lente.',
    exercises: [
      ['wide', 0, 4, 90],
      ['pull', 0, 3, 90],
      ['squat', 1, 3, 60],
      ['push', 2, 3, 75],
      ['hollow', 1, 3, 45],
      ['climbers', 0, 3, 45]
    ]
  }
];

// Guide : tout ce qu'il faut pour progresser en autonomie.
const SPORT_GUIDE = [
  {
    title: 'Utiliser l’onglet Sport',
    items: [
      'Clique sur une séance « Sport » dans l’agenda : tu arrives directement sur la séance du jour.',
      'Pour chaque exercice, note tes répétitions (ou secondes) série par série dans les petites cases.',
      'Lance le minuteur de repos entre deux séries avec le bouton ⏱.',
      'Le bouton ? affiche la technique, les erreurs à éviter et l’échelle de progression.',
      'Quand tu réussis le haut de la fourchette sur toutes les séries, un bandeau te propose la variante suivante : un clic et c’est changé.'
    ]
  },
  {
    title: 'La règle de progression (double progression)',
    items: [
      'Chaque exercice a une fourchette, par exemple 8–12 répétitions.',
      'Tant que tu n’atteins pas 12 sur toutes les séries, garde la même variante et essaie de faire 1 répétition de plus que la dernière fois.',
      'Quand tu fais 12 sur toutes les séries : passe à la variante suivante de l’échelle. Tu repartiras vers 8 répétitions, c’est normal.',
      'Si tu n’arrives pas à faire le bas de la fourchette (ex. moins de 8) : reviens à la variante précédente.',
      'Arrête chaque série en gardant 1 à 2 répétitions « en réserve » : proche de l’échec, mais avec une technique propre.'
    ]
  },
  {
    title: 'Technique et sécurité',
    items: [
      'La qualité avant la quantité : amplitude complète et descente lente (2–3 secondes).',
      'Courbatures les jours suivants : normal. Douleur vive ou articulaire (épaule, poignet, genou, dos) : arrête l’exercice et prends la variante plus facile.',
      'Vérifie toujours la solidité de ton matériel (table, porte, chaise) avant de t’en servir.',
      'Si tu as un problème de santé ou une ancienne blessure, demande l’avis d’un médecin avant de commencer.'
    ]
  },
  {
    title: 'Récupération',
    items: [
      'Garde au moins un jour de repos entre deux séances (lundi, mercredi, vendredi, c’est parfait).',
      'Le muscle se construit pendant le repos : vise 7 à 9 heures de sommeil.',
      'Tu as raté une séance ? Pas grave : reprends à la suivante, sans doubler.',
      'Toutes les 8 à 10 semaines, fais une semaine plus légère (2 séries au lieu de 3–4) pour récupérer.'
    ]
  },
  {
    title: 'Abdos visibles et pecs plus marqués',
    items: [
      'Tout le monde a des abdos : ils deviennent visibles quand la couche de graisse du ventre est assez fine.',
      'On ne peut pas « brûler la graisse du ventre » avec des abdos : elle part avec l’alimentation, sur tout le corps.',
      'Vise un léger déficit calorique (environ 300 à 500 kcal de moins par jour) : perdre environ 0,5 % de son poids par semaine préserve les muscles.',
      'Mange assez de protéines : environ 1,6 à 2 g par kg de poids par jour (viande, poisson, œufs, laitages, légumineuses, tofu).',
      'Pour les pecs, la clé est la progression : passer régulièrement aux variantes plus dures.',
      'Sois patient : les premiers changements visibles arrivent généralement après 8 à 12 semaines de régularité.'
    ]
  },
  {
    title: 'Quand faire évoluer le programme',
    items: [
      'Quand tu es en haut d’une échelle (ex. pompes archer faciles), ajoute une série ou mets un sac à dos chargé (livres, bouteilles d’eau).',
      'Le meilleur achat pour progresser : une barre de traction de porte (≈ 20–30 €) pour les tractions, excellentes pour le dos.',
      'Des élastiques de musculation ou des anneaux permettent ensuite de varier les exercices.',
      'Tu peux modifier chaque séance avec « ✎ Modifier » : changer une variante, ajouter un exercice depuis la bibliothèque, ajuster séries et repos.'
    ]
  }
];
