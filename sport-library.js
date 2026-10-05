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
          'Plus dur : les bras portent ≈ 70 % du poids du corps (≈ 64 % en pompes classiques). Sollicite un peu plus le haut des pecs.',
          'Plus les pieds sont hauts, plus c’est dur.'
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
    muscles: 'Pecs, avant des épaules, triceps (une variante des pompes, pas « plus pecs » que les classiques)',
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
        how: ['Pieds sur une chaise, le lit ou le canapé, mains larges.', 'Plus dur que les pompes larges au sol : plus de poids sur les bras.'],
        mistakes: ['Cambrer le dos.']
      }
    ]
  },
  close: {
    name: 'Pompes serrées',
    muscles: 'Triceps, pecs',
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
  row: {
    name: 'Rowing avec sac à dos',
    muscles: 'Dos (grands dorsaux, milieu du dos), arrière des épaules, biceps',
    cue: 'Dos plat, tire le coude vers la hanche, serre l’omoplate en haut.',
    note: 'Charge le sac avec des livres ou des bouteilles d’eau. Au début, garde-le assez léger pour une technique propre ; ajoute du poids avant de changer de variante.',
    steps: [
      {
        name: 'Rowing un bras avec sac à dos',
        reps: '10–15 / bras',
        how: [
          'Une main et un genou posés sur le lit ou le bord du canapé, l’autre pied au sol, dos plat.',
          'Sac à dos chargé tenu par la poignée, bras tendu vers le sol.',
          'Tire le sac vers la hanche en gardant le coude près du corps, puis redescends en 2 secondes.',
          'Fais toutes les répétitions d’un côté, puis change.'
        ],
        mistakes: ['Dos arrondi.', 'Tourner le buste pour lancer le sac.']
      },
      {
        name: 'Rowing penché deux mains avec sac à dos',
        reps: '10–15',
        how: [
          'Debout, pieds largeur de hanches, genoux légèrement fléchis.',
          'Penche le buste vers l’avant (environ 45°), dos bien plat, sac tenu à deux mains.',
          'Tire le sac vers le bas du ventre en serrant les omoplates, redescends lentement.'
        ],
        mistakes: ['Dos rond : plie davantage les genoux.', 'Se redresser pendant le mouvement.']
      },
      {
        name: 'Rowing penché sac à dos lesté, descente lente',
        reps: '8–12',
        how: [
          'Même position, sac plus lourd.',
          'Tiens 1 seconde en haut, omoplates serrées, puis descends en 3 secondes.'
        ],
        mistakes: ['Sacrifier l’amplitude pour le poids.']
      }
    ]
  },
  invrow: {
    name: 'Rowing inversé à la barre',
    muscles: 'Dos (milieu du dos, grands dorsaux), arrière des épaules, biceps',
    cue: 'Corps gainé, tire la poitrine vers la barre, serre les omoplates, redescends en 2 s.',
    note: 'Barre à pression dans l’encadrement d’une porte (pas entre deux cloisons en plâtre), à hauteur de hanches. Caoutchouc ou feutre sous les embouts pour ne pas marquer la peinture ; serre fort, teste en tirant doucement puis en mettant ton poids, et resserre-la à chaque séance. Plus la barre est basse, plus c’est dur.',
    steps: [
      {
        name: 'Rowing inversé à la barre, barre haute',
        reps: '8–12',
        how: [
          'Barre à hauteur de poitrine, mains écartées de la largeur des épaules.',
          'Avance les pieds sous la barre et penche-toi en arrière, bras tendus, corps droit.',
          'Tire la poitrine vers la barre en serrant les omoplates, coudes à ~45° du buste.',
          'Redescends en 2 secondes jusqu’aux bras tendus.'
        ],
        mistakes: ['Hanches qui cassent.', 'Épaules qui remontent vers les oreilles.']
      },
      {
        name: 'Rowing inversé à la barre, genoux fléchis',
        reps: '8–12',
        how: [
          'Barre à hauteur de hanches. Allongé dessous, mains largeur d’épaules, pieds à plat au sol, genoux fléchis.',
          'Corps gainé des épaules aux genoux.',
          'Monte jusqu’à ce que la poitrine frôle la barre, serre les omoplates 1 seconde, redescends en 2 secondes.'
        ],
        mistakes: ['Fesses qui pendent.', 'Tirer avec les bras sans serrer les omoplates.']
      },
      {
        name: 'Rowing inversé à la barre, jambes tendues',
        reps: '8–12',
        how: ['Même position, jambes tendues, appui sur les talons.', 'Corps droit comme une planche du début à la fin.'],
        mistakes: ['Hanches qui tombent.', 'Demi-amplitude.']
      },
      {
        name: 'Rowing inversé à la barre, pieds surélevés',
        reps: '8–12',
        how: ['Talons posés sur le lit ou le canapé, corps horizontal sous la barre.', 'Tire jusqu’à toucher presque la barre, descente lente.'],
        mistakes: ['Demi-amplitude.', 'Support qui glisse.']
      }
    ]
  },
  pike: {
    name: 'Pompes piquées (épaules)',
    muscles: 'Épaules (avant et milieu), triceps, haut des pecs',
    cue: 'Hanches hautes (V à l’envers), la tête descend devant les mains, coudes à ~45°.',
    steps: [
      {
        name: 'Pompes piquées sur les genoux',
        reps: '8–12',
        how: [
          'À genoux, mains au sol un peu devant toi, hanches hautes au-dessus des genoux.',
          'Plie les coudes pour descendre le haut de la tête vers le sol, un peu devant les mains.',
          'Pousse pour remonter jusqu’aux bras tendus.'
        ],
        mistakes: ['Coudes grands ouverts sur les côtés.', 'Descendre la poitrine au lieu de la tête (ça redevient une pompe).']
      },
      {
        name: 'Pompes piquées',
        reps: '6–10',
        how: [
          'Position de pompe, puis marche avec les pieds vers les mains pour former un V à l’envers, hanches hautes.',
          'Descends le haut de la tête vers le sol devant les mains, coudes à ~45°.',
          'Remonte en poussant le sol loin de toi.'
        ],
        mistakes: ['Hanches qui descendent.', 'Demi-amplitude.']
      },
      {
        name: 'Pompes piquées pieds surélevés (lit ou canapé)',
        reps: '6–10',
        how: [
          'Pieds sur le lit ou le canapé, mains au sol, hanches hautes : le buste se rapproche de la verticale.',
          'Même descente, la tête devant les mains.',
          'Plus les pieds sont hauts et les mains proches du support, plus c’est dur.'
        ],
        mistakes: ['Cambrer le dos.', 'Support qui glisse : cale-le contre un mur.']
      }
    ]
  },
  hamcurl: {
    name: 'Leg curl à la serviette',
    muscles: 'Arrière des cuisses (ischio-jambiers), fessiers',
    cue: 'Bassin haut tout le long, glisse lentement, ramène les talons en serrant les fessiers.',
    note: 'Sur parquet ou carrelage : serviette ou chaussettes sous les talons. Sur moquette : un sac plastique ou une assiette en carton glisse mieux.',
    steps: [
      {
        name: 'Leg curl à la serviette, aller seulement',
        reps: '6–10',
        how: [
          'Sur le dos, genoux pliés, talons posés sur une serviette, sur un sol lisse.',
          'Monte le bassin comme pour un pont fessier.',
          'Bassin haut, fais glisser les talons loin de toi en 4 secondes, jusqu’aux jambes presque tendues.',
          'Pose les fesses, ramène les pieds, recommence.'
        ],
        mistakes: ['Bassin qui tombe pendant la glissade.', 'Aller trop vite : tout l’effet vient de la lenteur.']
      },
      {
        name: 'Leg curl à la serviette',
        reps: '8–12',
        how: [
          'Même départ, bassin haut.',
          'Glisse les talons loin de toi en 3 secondes, puis ramène-les vers les fesses sans laisser descendre le bassin.'
        ],
        mistakes: ['Cambrer le bas du dos pour tirer.', 'Bassin qui retombe au retour.']
      },
      {
        name: 'Leg curl à la serviette sur une jambe',
        reps: '6–10 / jambe',
        how: ['Même mouvement avec un seul talon sur la serviette, l’autre jambe tendue en l’air.'],
        mistakes: ['Bassin qui penche d’un côté.']
      }
    ]
  },
  back: {
    name: 'Dos au sol',
    muscles: 'Bas et haut du dos, arrière des épaules (posture)',
    cue: 'Allongé sur le ventre, regard vers le sol, mouvements lents et contrôlés.',
    steps: [
      {
        name: 'Superman',
        reps: '10–15',
        how: [
          'Allongé sur le ventre, bras tendus devant toi.',
          'Décolle en même temps bras, poitrine et jambes de quelques centimètres.',
          'Tiens 2 secondes en haut en serrant les fessiers, puis redescends.'
        ],
        mistakes: ['Relever la tête (garde le regard vers le sol).', 'Monter trop haut en cambrant fort.']
      },
      {
        name: 'Y-T-W allongé',
        reps: '6–8 par lettre',
        how: [
          'Allongé sur le ventre, front sur une serviette roulée.',
          'Y : bras tendus en diagonale au-dessus de la tête, pouces vers le haut, décolle-les du sol.',
          'T : bras tendus sur les côtés, décolle-les en serrant les omoplates.',
          'W : coudes pliés le long du corps, ramène les omoplates vers le bas et l’arrière.'
        ],
        mistakes: ['Hausser les épaules vers les oreilles.', 'Aller trop vite.']
      },
      {
        name: 'Y-T-W tenus 3 secondes',
        reps: '5–8 par lettre',
        how: ['Même enchaînement, en tenant chaque position 3 secondes en haut.'],
        mistakes: ['Retenir sa respiration.']
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
        how: ['Tiens-toi à un meuble stable ou à l’encadrement d’une porte.', 'Descends en poussant les hanches en arrière, remonte en poussant dans le sol.'],
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
        how: ['Dessus du pied arrière posé sur une chaise, le lit ou le canapé.', 'Descends jusqu’à ce que la cuisse avant soit parallèle au sol.'],
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
    muscles: 'Surtout les fléchisseurs de hanche ; les abdos travaillent vraiment quand le bassin s’enroule (voir le crunch inversé)',
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
  revcrunch: {
    name: 'Crunch inversé',
    muscles: 'Abdos (grand droit) : le bassin s’enroule vers les côtes',
    cue: 'Le mouvement vient du bassin qui s’enroule, pas des jambes qui se balancent.',
    steps: [
      {
        name: 'Crunch inversé',
        reps: '10–15',
        how: [
          'Allongé sur le dos, bras le long du corps, paumes au sol.',
          'Genoux pliés à 90°, cuisses à la verticale au-dessus des hanches.',
          'Enroule le bassin pour décoller les fesses du sol et rapprocher les genoux de la poitrine, en soufflant.',
          'Redescends en 2 secondes jusqu’à ce que le bas du dos touche le sol, sans reposer les pieds.'
        ],
        mistakes: ['Prendre de l’élan avec les jambes.', 'Pousser fort sur les mains pour décoller.']
      },
      {
        name: 'Crunch inversé, descente lente (3 s)',
        reps: '10–15',
        how: [
          'Même mouvement que le crunch inversé.',
          'Tiens 1 seconde en haut, puis déroule le dos vertèbre par vertèbre en 3 secondes.'
        ],
        mistakes: ['Laisser retomber le bassin d’un coup.']
      },
      {
        name: 'Crunch inversé jambes tendues',
        reps: '8–12',
        how: [
          'Allongé, mains au sol ou sous les fesses, jambes tendues à la verticale.',
          'Décolle les fesses en montant les pieds vers le plafond (pas vers la tête).',
          'Redescends lentement le bassin, puis les jambes sans toucher le sol.'
        ],
        mistakes: ['Balancer les jambes pour monter.', 'Dos qui se cambre en bas.']
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
      },
      {
        name: 'Crunch lesté (sac à dos contre la poitrine)',
        reps: '10–15',
        how: [
          'Même position que le crunch, un sac à dos chargé (ou des livres) tenu contre la poitrine.',
          'Enroule le haut du dos en soufflant, tiens 1 seconde, redescends en 2 secondes.',
          'Ajoute du poids dans le sac quand tu dépasses 15 répétitions.'
        ],
        mistakes: ['Tirer le sac vers le haut avec les bras.', 'Décoller le bas du dos.']
      }
    ]
  }
};

// Programme v5 : 3 séances full body, accent pecs + abdos, sans meuble solide
// (barre de traction à pression posée bas pour le rowing inversé).
// Par semaine : ≈ 11 séries de poussée horizontale + 3 d'épaules (pompes
// piquées), 13 de tirage (rowings + Y-T-W), 12 de jambes (dont arrière des
// cuisses), abdos en flexion + gainage. [échelle, étape de départ, séries, repos en s]
const SPORT_PROGRAM_VERSION = 5;
// Anciens noms (avec la lettre), pour reconnaître et renommer les séances existantes.
const SPORT_PROGRAM_OLD_NAMES = ['A — Pecs & abdos', 'B — Dos, jambes & gainage', 'C — Pecs & abdos (volume)'];
// Programme v4, pour reconnaître les séances jamais modifiées à la main.
const SPORT_PROGRAM_V4_NAMES = ['Pecs & abdos', 'Dos, jambes & gainage', 'Pecs & abdos (volume)'];
const SPORT_PROGRAM_V4_DESCRIPTIONS = [
  'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules dans chaque sens, 10 squats lents, 10 pompes faciles (contre un mur).\n' +
    'Note tes répétitions série par série : le site te dira quand passer à la variante suivante.',
  'Échauffement (5 min) : 30 s de montées de genoux, 10 rotations de hanches, 10 squats lents, 10 supermans lents.\n' +
    'Le dos équilibre le travail des pecs : épaules en arrière, posture droite, pecs mieux mis en valeur.',
  'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules, 10 pompes faciles, 10 squats.\n' +
    'Séance la plus orientée pecs de la semaine : soigne l’amplitude et la descente lente.'
];
const SPORT_PROGRAM = [
  {
    weekday: 1,
    name: 'Pecs & abdos',
    description:
      'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules dans chaque sens, 10 squats lents, 10 pompes faciles (contre un mur).\n' +
      'Barre de traction dans l’encadrement d’une porte, à hauteur de hanches, caoutchouc ou feutre sous les embouts : serre-la et teste-la avant de commencer.\n' +
      'Note tes répétitions série par série : le site te dira quand passer à la variante suivante.',
    exercises: [
      ['push', 2, 4, 90],
      ['invrow', 1, 3, 90],
      ['squat', 1, 3, 60],
      ['back', 1, 3, 45],
      ['revcrunch', 0, 3, 45],
      ['plank', 1, 3, 45]
    ]
  },
  {
    weekday: 3,
    name: 'Dos, jambes & gainage',
    description:
      'Échauffement (5 min) : 30 s de montées de genoux, 10 rotations de hanches, 10 squats lents, 10 supermans lents.\n' +
      'Le dos équilibre le travail des pecs : épaules en arrière, posture droite, pecs mieux mis en valeur.\n' +
      'Leg curl : sur parquet ou carrelage, une serviette ou des chaussettes sous les talons.',
    exercises: [
      ['row', 1, 4, 90],
      ['close', 1, 3, 75],
      ['squat', 2, 3, 60],
      ['hamcurl', 0, 3, 60],
      ['side', 1, 3, 45],
      ['hollow', 0, 3, 45]
    ]
  },
  {
    weekday: 5,
    name: 'Pecs, épaules & abdos',
    description:
      'Échauffement (5 min) : 30 s de jumping jacks, 10 rotations d’épaules, 10 pompes faciles, 10 squats.\n' +
      'Barre de traction à hauteur de hanches, bien serrée (teste-la avant).\n' +
      'Pompes piquées : hanches hautes, la tête descend devant les mains. C’est l’exercice des épaules de la semaine.',
    exercises: [
      ['push', 2, 4, 90],
      ['invrow', 1, 3, 90],
      ['squat', 1, 3, 60],
      ['pike', 0, 3, 75],
      ['hollow', 1, 3, 45],
      ['crunch', 0, 3, 45]
    ]
  }
];

// Vidéos YouTube (vérifiées : existantes et intégrables), une par variante.
// null = pas de vidéo fiable trouvée : le bouton « Autres vidéos » reste disponible.
const SPORT_VIDEOS = {
  push: ['emhF1efZ-38', '5O7QVJ4s6iw', 'SWUw2epT8P4', '50Yr6Mm78u0', 'Dl1M2oeljAw', 'T3vnPh3Cjnk'],
  wide: ['hzDFtOWJstY', 'hzDFtOWJstY', 'hzDFtOWJstY'],
  close: ['FvnPL4cYUQk', 'FvnPL4cYUQk', '5QH97LnIXgo', 'mhVgRRoNAgg'],
  pull: [null, '5i7zfFO9RH4', 'kAP0skZtWDg', 'QWbY1Nt1FYU'],
  row: ['puaKVJOY8eg', 'aGTrrWvX6vk', '4PqtlMA-45Y'],
  invrow: [null, '5i7zfFO9RH4', 'kAP0skZtWDg', 'QWbY1Nt1FYU'],
  pike: [null, null, null],
  hamcurl: [null, null, null],
  back: ['KuddSXD0Jk0', 'ZpZEQ2JCXyc', 'LSy6R7j3PDc'],
  squat: ['tPTVVEaYza0', 'RhusC-zA56k', 'Ey1o1oQ8x6M', 'eCJxHKDXBqk', null],
  hinge: ['9Wma4mC8wpw', 'QWu5ApIBD9A', null],
  plank: ['JCLxkG7ULfM', 'mv42eVXvMDc', null],
  side: ['hAWS7C17uJY', 'fIkpxa-kuIA', 'hAWS7C17uJY'],
  legraise: [null, 'ce-DMxpDIf8', null],
  revcrunch: [null, null, null],
  hollow: ['6n7ZWnV8snU', 'HAfUt2Cco74', 'HAfUt2Cco74'],
  climbers: ['e9Nwd8ckkYA', 'e9Nwd8ckkYA', 'K3Xt4QH4b-U'],
  crunch: ['PtqG6BmZW4o', null, null]
};

// Exercices exclus par défaut (à la demande de l'utilisateur).
const SPORT_DEFAULT_EXCLUDED = [
  'Rowing serviette à la porte',
  'Rowing inversé sous une table, genoux fléchis',
  'Rowing inversé sous une table, jambes tendues',
  'Rowing inversé pieds surélevés'
];

// Échelle de repli quand toutes les variantes d'une échelle sont exclues.
const SPORT_LADDER_FALLBACK = { pull: 'row', invrow: 'row' };

// Conseils affichés dans la fiche « ? » de chaque exercice.
const SPORT_TIPS = {
  progression: [
    'Objectif de chaque séance : faire autant ou mieux que la dernière fois (les chiffres grisés dans les cases).',
    'Quand tu atteins le haut de la fourchette sur toutes les séries, passe à la variante suivante (le site te le propose).',
    'Si tu n’atteins pas le bas de la fourchette, reviens à la variante précédente.',
    'Intensité : arrête chaque série quand il ne te reste plus que 1 à 3 répétitions propres « en réserve ». Des séries trop faciles ne font presque pas progresser.'
  ],
  safety: [
    'Courbatures : normal. Douleur vive ou articulaire : arrête et prends la variante plus facile.',
    'Vérifie la solidité du matériel (table, chaise) avant de t’en servir.',
    'Barre de traction à pression : dans l’encadrement d’une porte, embouts protégés (caoutchouc, feutre), serrée et testée à chaque séance avant de mettre tout ton poids.'
  ],
  abs: [
    'Les abdos se construisent ici, mais ne deviennent visibles que si la graisse du ventre est assez fine : ça se joue surtout dans l’assiette.',
    'Faire des abdos ne fait pas fondre la graisse du ventre : on ne perd pas de gras à un endroit choisi.',
    'Vise un léger déficit calorique (≈ 300–500 kcal de moins par jour) et assez de protéines (≈ 1,6–2 g par kg de poids par jour).',
    'Dors 7 à 9 h : le manque de sommeil freine la récupération et augmente la faim.'
  ]
};
