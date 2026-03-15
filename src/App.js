import { useState, useEffect, useRef } from “react”;

const G = `@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;600;800&family=DM+Sans:wght@300;400;500;700&family=JetBrains+Mono:wght@400;600&display=swap'); *{box-sizing:border-box;margin:0;padding:0} html,body{background:#08090e;min-height:100vh} ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#1e2535;border-radius:3px} .back{cursor:pointer;background:none;border:none;color:#445;font:12px 'JetBrains Mono',monospace;letter-spacing:2px;padding:0;transition:color .2s} .back:hover{color:#aaa} .opt{display:block;width:100%;text-align:left;padding:13px 18px;margin-bottom:9px;border-radius:8px;cursor:pointer;border:1px solid #1e2535;background:#0e1018;font:14px 'DM Sans',sans-serif;color:#bbb;transition:all .15s;line-height:1.5} .opt:hover:not(:disabled){border-color:var(--acc);color:#fff;background:#141820} .opt-ok{border-color:#06d6a0!important;background:rgba(6,214,160,.1)!important;color:#06d6a0!important} .opt-no{border-color:#e94560!important;background:rgba(233,69,96,.1)!important;color:#e94560!important} .btn{cursor:pointer;padding:11px 26px;border-radius:7px;font:600 13px 'DM Sans',sans-serif;transition:all .2s;border:none} .btn:hover{opacity:.85;transform:translateY(-1px)} .wave{display:inline-block;width:3px;border-radius:2px;margin:0 1.5px;animation:wv 1s ease-in-out infinite} @keyframes wv{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} .fadein{animation:fadeUp .35s ease both} .pill{display:inline-block;padding:3px 10px;border-radius:20px;font:11px 'JetBrains Mono',monospace;letter-spacing:1px} .card{background:#0d0f18;border:1px solid #1a1f2e;border-radius:12px;padding:20px;margin-bottom:12px}`;

// ─── DONNÉES MODULES DGAC ───
const MODULES = [
{
id:“reglementation”,icon:“⚖️”,title:“Réglementation EASA/DGAC”,color:”#e94560”,bg:”#130810”,niveau:“Fondamental”,duree:“45 min”,
cours:[
{titre:“Les 3 catégories d’opération UAS (EASA)”,contenu:`Depuis le 31 décembre 2020, la réglementation européenne harmonisée des drones s'applique dans tous les États membres de l'UE.\n\nLa catégorie Ouverte (Open) concerne les vols à faible risque, sans autorisation préalable. Le drone doit peser moins de 25kg, voler sous 120m et rester en vue directe.\n\nLa catégorie Spécifique (Specific) s'applique aux opérations à risque modéré comme la photogrammétrie professionnelle en zone peuplée. Elle requiert une évaluation SORA et une autorisation DGAC via scénario STS ou autorisation particulière.\n\nLa catégorie Certifiée concerne les opérations à risque élevé. Elle exige une certification complète.`},
{titre:“Catégorie Ouverte — Sous-catégories A1, A2, A3”,contenu:`La catégorie Ouverte est divisée en trois sous-catégories.\n\nA1 : survol de personnes avec drones légers C0 (moins de 250g) ou C1 (moins de 900g).\n\nA2 : vol à proximité de personnes avec drones C2. Nécessite l'examen théorique A2 de la DGAC (40 questions, seuil 75%, durée 30 minutes).\n\nA3 : zones éloignées de toute zone habitée, avec drones C3 et C4.\n\nPour piloter en A2, le télépilote doit avoir réussi l'examen DGAC et détenir une attestation de compétences pratiques.`},
{titre:“Zones géographiques et espaces aériens”,contenu:`Les zones CTR entourent les aérodromes contrôlés. Le vol de drone y est soumis à autorisation préalable via Alpha Tango.\n\nLes zones R (Réglementées) sont des espaces soumis à conditions. Les zones D (Dangereuses) signalent des activités potentiellement dangereuses. Les zones P (Interdites) sont totalement fermées : centrales nucléaires, palais présidentiels.\n\nEn France, consultez Géoportail aviation et l'application Alpha Tango avant tout vol pour vérifier les zones actives en temps réel.\n\nUn vol dans une zone activée sans autorisation constitue une infraction grave.`},
{titre:“Responsabilités, assurances et déclarations”,contenu:`L'assurance responsabilité civile est obligatoire pour tous les drones utilisés professionnellement, quelle que soit leur masse. Elle couvre les dommages causés aux tiers.\n\nLe télépilote est responsable de la sécurité du vol. L'opérateur est responsable de la conformité réglementaire.\n\nLa déclaration d'accident est obligatoire dans les 72 heures pour tout incident impliquant des tiers ou des dommages importants. Déclaration auprès de la DGAC.\n\nLe respect de la vie privée est encadré par le RGPD. La captation d'images de personnes identifiables sans consentement est soumise à des règles strictes.`}
],
quiz:[
{q:“Quel règlement européen définit les règles d’exploitation des drones ?”,opts:[“2019/945”,“2019/947”,“2021/664”,“785/2004”],a:1,exp:“Le règlement 2019/947 définit les règles d’exploitation UAS. Le 2019/945 définit les exigences techniques (classes C0-C6).”},
{q:“L’examen théorique A2 comporte combien de questions ?”,opts:[“20”,“30”,“40”,“50”],a:2,exp:“L’examen A2 DGAC comporte 40 questions avec un seuil de réussite à 75% (30/40 bonnes réponses).”},
{q:“Que signifie STS-01 ?”,opts:[“Scénario standard VLOS en zone habitée”,“Scénario BVLOS en zone peu peuplée”,“Autorisation temporaire”,“Certification drone C1”],a:0,exp:“STS-01 = Scénario Standard 01 = opérations VLOS (vue directe) au-dessus de zones habitées.”},
{q:“Zone ‘P’ dans l’espace aérien =”,opts:[“Zone parachutisme”,“Zone réglementée”,“Zone interdite”,“Zone dangereuse”],a:2,exp:“P = Prohibited (interdite). R = Restricted (réglementée). D = Dangerous (dangereuse).”},
{q:“Délai légal de déclaration d’accident à la DGAC :”,opts:[“24h”,“48h”,“72h”,“7 jours”],a:2,exp:“72 heures pour déclarer tout accident ou incident grave impliquant des tiers ou menaçant la sécurité aérienne.”}
]
},
{
id:“meteo”,icon:“🌤️”,title:“Météorologie & Navigation”,color:”#f4a261”,bg:”#130f07”,niveau:“Intermédiaire”,duree:“40 min”,
cours:[
{titre:“Lire une METAR”,contenu:`La METAR est le bulletin météo standardisé des aérodromes, émis toutes les heures.\n\nDécryptage : LFPG 141200Z 27015KT 9999 FEW020 BKN080 15/08 Q1012 NOSIG\n\nLFPG = indicatif OACI. 141200Z = le 14 à 12h UTC. 27015KT = vent 270° à 15 nœuds. 9999 = visibilité >10km. FEW020 = quelques nuages à 2000ft. BKN080 = nuages fragmentés à 8000ft. 15/08 = température 15°C, rosée 8°C. Q1012 = QNH 1012 hPa. NOSIG = pas de changement prévu.\n\nPour un vol drone : vérifiez le vent (< limite constructeur), la visibilité (VLOS), le plafond nuageux.`},
{titre:“Phénomènes météo dangereux”,contenu:`Le givrage se produit entre -10°C et +5°C en conditions nuageuses. Il modifie le profil des hélices, réduit la portance et peut causer un crash.\n\nL'orage est une interdiction absolue de vol. Ne volez jamais à moins de 20km d'un cumulonimbus. Les vents violents, la grêle et les éclairs s'étendent bien au-delà du nuage visible.\n\nLa brume (1-5km) et le brouillard (<1km) empêchent le maintien de la vue directe et dégradent la qualité des images photogrammétriques.\n\nLa pluie endommage les composants électroniques non protégés et crée du motion blur sur les images.`},
{titre:“NOTAMs et altimétrie”,contenu:`Un NOTAM (Notice to Airmen) informe les pilotes de restrictions temporaires : exercices militaires, spectacles aériens, chantiers, pannes d'équipements.\n\nConsultez les NOTAMs via le SIA français ou l'application Alpha Tango avant tout vol professionnel.\n\nL'altitude AGL (Above Ground Level) est la hauteur par rapport au sol. La réglementation drone exprime les limites en hauteur AGL. C'est la mesure la plus pertinente pour vous.\n\nLe QNH est la pression atmosphérique ramenée au niveau de la mer. Calé sur l'altimètre, il donne l'altitude vraie.`}
],
quiz:[
{q:“BKN dans une METAR =”,opts:[“Ciel dégagé”,“Quelques nuages 1-2/8”,“Nuages fragmentés 5-7/8”,“Couvert 8/8”],a:2,exp:“SKC/CLR=dégagé | FEW=1-2/8 | SCT=3-4/8 | BKN=5-7/8 (fragmenté) | OVC=8/8 (couvert).”},
{q:“Distance minimale sécurité orage drone :”,opts:[“5km”,“10km”,“20km”,“50km”],a:2,exp:“20 km minimum de tout cumulonimbus. Les vents, turbulences et éclairs s’étendent loin du nuage visible.”},
{q:“AGL signifie :”,opts:[“Altitude niveau mer”,“Hauteur au-dessus du sol”,“Angle de glide limite”,“Altitude légale garantie”],a:1,exp:“AGL = Above Ground Level = hauteur par rapport au sol. La réglementation drone exprime les limites en hauteur AGL.”},
{q:“QNH = :”,opts:[“Vitesse vent en nœuds”,“Pression atmosphérique niveau mer”,“Direction vent magnétique”,“Température haute altitude”],a:1,exp:“QNH = pression atmosphérique corrigée au niveau de la mer. Calé sur l’altimètre, il donne l’altitude vraie.”},
{q:“NOSIG dans une METAR signifie :”,opts:[“Vent nul”,“Pas de signal GPS”,“Pas de changement significatif”,“Nuages non significatifs”],a:2,exp:“NOSIG = No Significant change. Aucune évolution importante des conditions météo n’est prévue dans les 2 heures.”}
]
},
{
id:“aerodynamique”,icon:“🔧”,title:“Mécanique du vol & Aérodynamique”,color:”#48cae4”,bg:”#070f15”,niveau:“Intermédiaire”,duree:“35 min”,
cours:[
{titre:“Les forces agissant sur le drone”,contenu:`Un multirotor est soumis à quatre forces en vol stationnaire.\n\nLa poussée (thrust) est la force verticale ascendante générée par la rotation des hélices. Elle doit égaler le poids en stationnaire.\n\nLe poids est la force gravitationnelle. Tout le travail des moteurs consiste à la compenser.\n\nLa traînée est la résistance de l'air au déplacement. Elle s'oppose au mouvement et augmente avec le carré de la vitesse.\n\nLa portance est générée par la différence de pression entre dessus et dessous des pales. Décrite par l'équation de Bernoulli.`},
{titre:“Batteries LiPo — technologie et sécurité”,contenu:`La tension nominale d'une cellule LiPo est de 3,7V. Tension de charge max : 4,2V par cellule. Tension minimale : 3,0V par cellule. Décharger en dessous endommage irrémédiablement la batterie.\n\nLe froid réduit l'autonomie de 20 à 50%. En dessous de 0°C, certaines batteries refusent de se charger. Préchauffez-les à ~20°C en hiver.\n\nEn cas de dommage physique ou de surcharge, les LiPo peuvent s'enflammer (emballement thermique). Conservez-les dans des sacs ignifuges.\n\nStockage idéal : 3,8V par cellule.`},
{titre:“Systèmes de navigation — GPS, IMU, boussole”,contenu:`Le GNSS (GPS, GLONASS, Galileo, BeiDou) donne la position avec une précision de 2 à 5m horizontalement. Les récepteurs multi-constellations améliorent précision et disponibilité.\n\nL'IMU (Inertial Measurement Unit) comprend des accéléromètres et gyroscopes. Elle permet au contrôleur de vol de réagir très rapidement aux perturbations.\n\nLe baromètre mesure la variation de pression pour calculer la hauteur relative. Précision ~10-30cm en conditions stables.\n\nLa boussole donne l'orientation absolue. Les structures métalliques, lignes haute tension et sols magnétiques peuvent la perturber. Calibrez à chaque changement de lieu.`}
],
quiz:[
{q:“Tension minimale cellule LiPo sans dommages :”,opts:[“2,5V”,“3,0V”,“3,5V”,“3,7V”],a:1,exp:“3,0V/cellule est la limite absolue. En dessous, les cellules se sulfatent et perdent leur capacité de façon irréversible.”},
{q:“Précision GPS civil standard :”,opts:[”<1m”,“2-5m”,“10-20m”,“50m”],a:1,exp:“GPS civil : 2-5m horizontal, 5-10m vertical. Le RTK/PPK améliore cela à 1-3cm par correction différentielle.”},
{q:“Le vortex ring state se produit lors de :”,opts:[“Vol haute altitude”,“Descente rapide à faible vitesse horizontale”,“Décollage vent fort”,“Virages serrés”],a:1,exp:“Le VRS survient en descente verticale rapide : le drone redescend dans son propre souffle et perd brutalement de la portance.”},
{q:“L’IMU comprend :”,opts:[“GPS + baromètre”,“Accéléromètres + gyroscopes”,“Magnétomètre + altimètre”,“Caméra + lidar”],a:1,exp:“L’IMU = accéléromètres (mesure les accélérations linéaires) + gyroscopes (mesure les rotations angulaires).”},
{q:“Tension de stockage idéale LiPo :”,opts:[“3,0V/cellule”,“3,7V/cellule”,“3,8V/cellule”,“4,2V/cellule”],a:2,exp:“3,8V/cellule est la tension de stockage idéale LiPo. 3,7V = nominale, 4,2V = pleine charge, 3,0V = décharge minimale.”}
]
},
{
id:“photogrammetrie”,icon:“📐”,title:“Photogrammétrie”,color:”#00b4d8”,bg:”#071015”,niveau:“Professionnel”,duree:“50 min”,
cours:[
{titre:“GSD, altitude et plan de vol”,contenu:`Le GSD (Ground Sampling Distance) est la dimension réelle d'un pixel au sol. C'est le paramètre fondamental de planification.\n\nFormule : GSD = Altitude × Taille photosite / Focale\n\nExemple : 100m × 0,0044mm / 24mm = 18,3mm = 1,83 cm/pixel\n\nPour un GSD cible, inversez : Altitude = GSD × Focale / Taille photosite\n\nRecouvrement recommandé : overlap longitudinal 70-80%, sidelap latéral 60-70%. Pour terrain complexe ou végétation dense : 80-85%.`},
{titre:“Structure from Motion (SfM)”,contenu:`Le SfM analyse les photos pour reconnaître des points communs (keypoints) entre images. Les algorithmes SIFT et SURF identifient ces points caractéristiques invariants à l'échelle et à la rotation.\n\nÉtapes : détection de keypoints → mise en correspondance entre images → estimation des positions caméra → nuage de points épars → densification.\n\nLes zones uniformes (eau, sable, gazon ras) génèrent peu de keypoints et créent des trous dans le modèle. Augmentez l'overlap dans ces zones.\n\nLogiciels : Agisoft Metashape (licence perpétuelle), Pix4D (abonnement), DroneDeploy (cloud), RealityCapture (GPU rapide).`},
{titre:“GCPs, RTK, PPK — Géoréférencement précis”,contenu:`Les GCPs (Ground Control Points) sont des points physiques au sol avec coordonnées précises mesurées au GNSS différentiel. Minimum 5 GCPs pour une zone rectangulaire : 4 coins + 1 centre. Gardez des check points indépendants pour valider la précision.\n\nRTK (Real-Time Kinematic) : correction différentielle en temps réel via radio. Précision 1-3cm. Nécessite une liaison radio permanente.\n\nPPK (Post-Processing Kinematic) : données brutes enregistrées pendant le vol, corrigées après. Plus robuste que le RTK (pas de risque de perte liaison). Précision identique ou supérieure.\n\nSystème légal France : Lambert 93 (EPSG:2154). Altitudes en NGF-IGN69. Conversion GPS→NGF via ondulation de géoïde (modèle RAF20).`}
],
quiz:[
{q:“Formule du GSD :”,opts:[“Focale × Photosite / Altitude”,“Altitude × Photosite / Focale”,“Altitude × Focale / Photosite”,“Photosite / (Altitude × Focale)”],a:1,exp:“GSD = Altitude × Taille photosite / Focale. Exemple : 100m × 0.0044mm / 24mm = 18.3mm = 1.83 cm/pixel.”},
{q:“Overlap longitudinal recommandé :”,opts:[“20-30%”,“40-50%”,“70-80%”,“95-100%”],a:2,exp:“70-80% d’overlap longitudinal et 60-70% de sidelap sont recommandés pour une bonne reconstruction 3D.”},
{q:“Nombre minimum de GCPs zone rectangulaire :”,opts:[“3”,“4”,“5”,“10”],a:2,exp:“Minimum 5 GCPs : 1 dans chaque coin + 1 au centre. Garder certains comme check points indépendants.”},
{q:“MNT représente :”,opts:[“Tous les objets en surface”,“Le sol nu uniquement”,“Uniquement la végétation”,“Les bâtiments uniquement”],a:1,exp:“MNT = sol nu filtré. MNS = surface complète (sol + objets). MNS - MNT = hauteur des objets (canopée, bâti).”},
{q:“Lambert 93 = EPSG :”,opts:[“4326”,“2154”,“32631”,“4230”],a:1,exp:“EPSG:2154 = Lambert-93 = système légal France métropolitaine. EPSG:4326 = WGS84 géographique (GPS).”}
]
},
{
id:“securite”,icon:“🛡️”,title:“Sécurité & Gestion des risques”,color:”#06d6a0”,bg:”#051510”,niveau:“Fondamental”,duree:“30 min”,
cours:[
{titre:“La méthode SORA”,contenu:`La SORA (Specific Operations Risk Assessment) est la méthode JARUS/EASA pour évaluer les risques en catégorie Spécifique.\n\nGRC (Ground Risk Class) : risque d'impact sur des personnes au sol. Prend en compte la densité de population, la masse du drone et son énergie cinétique.\n\nARC (Air Risk Class) : risque de collision avec d'autres aéronefs selon l'espace aérien utilisé.\n\nSAIL (Specific Assurance and Integrity Level) de 1 à 6 : combinaison de GRC et ARC. Détermine les OSO (Operational Safety Objectives) = mesures de sécurité obligatoires.\n\nPhotogrammétrie en zone peu peuplée sous 120m → SAIL 1 ou 2. Zone urbaine dense → SAIL 4 ou 5.`},
{titre:“Procédures d’urgence et check-lists”,contenu:`La check-list pré-vol doit couvrir : vérification des autorisations et NOTAMs, état des batteries (niveau, absence de gonflement), calibration boussole si nouveau site, état des hélices (fissures, fixation), test des commandes au sol, confirmation du home point et altitude RTH.\n\nRTH (Return to Home) : configurez l'altitude RTH au-dessus de l'obstacle le plus haut + marge de 30m minimum.\n\nEn cas de comportement anormal : écartez immédiatement le drone des zones habitées. Sécurité des tiers = priorité absolue. Il vaut mieux perdre le drone que blesser quelqu'un.\n\nEn cas de défaillance moteur sur hexarotor/octorotor : la redondance permet souvent un atterrissage d'urgence contrôlé.`}
],
quiz:[
{q:“SAIL dans la méthode SORA :”,opts:[“Système Autonome Intégré Léger”,“Specific Assurance and Integrity Level”,“Suivi Aérien Intégré Légal”,“Service d’Autorisation Individuelle”],a:1,exp:“Le SAIL (Specific Assurance and Integrity Level, niveaux 1 à 6) détermine les mesures de mitigation (OSO) requises.”},
{q:“Priorité absolue en cas de comportement anormal :”,opts:[“Maintenir la mission”,“Récupérer le drone”,“Écarter des zones habitées”,“Appeler le constructeur”],a:2,exp:“Sécurité des tiers = PRIORITÉ ABSOLUE. Un drone perdu se remplace. Une blessure est irréversible.”},
{q:“L’altitude RTH doit être configurée :”,opts:[“À 10m”,“Au-dessus de l’obstacle le plus haut + marge”,“À 120m toujours”,“Selon la météo”],a:1,exp:“RTH altitude > obstacle le plus haut de la zone + marge de sécurité (30m minimum) pour éviter toute collision au retour.”},
{q:“GRC dans SORA = :”,opts:[“Ground Risk Class”,“General Risk Control”,“GPS Reference Coordinate”,“Ground Regulation Code”],a:0,exp:“GRC = Ground Risk Class. Évalue le risque d’impact sur des personnes au sol. Combiné à l’ARC pour calculer le SAIL.”}
]
}
];

// ─── DONNÉES FAA PART 107 ───
const FAA_MODULES = [
{
id:“faa_intro”,icon:“🇺🇸”,title:“FAA Part 107 — Vue d’ensemble”,color:”#3b82f6”,bg:”#070a15”,cours:[
{titre:“Qu’est-ce que la certification FAA Part 107 ?”,contenu:`La FAA Part 107 (14 CFR Part 107) est la réglementation fédérale américaine pour les opérations commerciales de drones. Toute activité commerciale aux USA nécessite le Remote Pilot Certificate.\n\nPour être éligible : avoir au moins 16 ans, parler et comprendre l'anglais, être en condition physique et mentale appropriée, ne pas faire l'objet d'un refus de certificat FAA.\n\nBonne nouvelle : les Français peuvent obtenir le Part 107 dans les mêmes conditions que les Américains. Aucune restriction de nationalité.\n\nProcessus : créer un compte IACRA (iacra.faa.gov) pour obtenir votre FTN → réserver un créneau dans un Knowledge Testing Center → passer l'examen UAG (60 questions, seuil 70%, ~175$) → soumettre la demande via IACRA.`},
{titre:“Règles de base Part 107”,contenu:`Altitude maximale : 400 pieds AGL (~120m). Exception : dans un rayon de 400ft d'une structure, vous pouvez dépasser 400ft de la hauteur de la structure.\n\nVitesse maximale : 100 mph (87 nœuds).\n\nVisibilité minimale : 3 statute miles (~5km).\n\nDégagement nuages : 500ft en dessous, 2000ft horizontalement.\n\nVol de jour ou crépuscule civil (30min avant lever / après coucher du soleil) avec éclairage anticollision visible à 3 miles.\n\nVLOS obligatoire (vue directe). Avec FPV : observateur visuel requis.\n\nInterdit au-dessus de personnes non impliquées (sauf catégories 1-4).\n\nCertificat valide 24 mois. Renouvellement : formation en ligne gratuite (ALC-677), pas de re-examen.`}
],
quiz:[
{q:“Seuil de réussite examen FAA Part 107 :”,opts:[“60%”,“70%”,“75%”,“80%”],a:1,exp:“70% = 42 bonnes réponses sur 60 questions. Différent de l’examen DGAC français (75%).”},
{q:“Un Français peut-il obtenir le Part 107 ?”,opts:[“Non, réservé US”,“Oui avec restrictions”,“Oui, mêmes conditions”,“Seulement avec visa travail”],a:2,exp:“La FAA n’impose aucune restriction de nationalité. Un Français peut passer l’examen Part 107 dans les mêmes conditions.”},
{q:“Altitude maximale Part 107 :”,opts:[“300ft”,“400ft”,“500ft”,“600ft”],a:1,exp:“400ft AGL (~120m). Exception : +400ft si dans 400ft d’une structure.”},
{q:“Visibilité minimale Part 107 :”,opts:[“1 SM”,“2 SM”,“3 SM”,“5 SM”],a:2,exp:“3 statute miles (~5km) depuis la position du pilote.”},
{q:“Remote Pilot Certificate valide :”,opts:[“12 mois”,“24 mois”,“36 mois”,“À vie”],a:1,exp:“24 mois. Renouvellement via formation en ligne gratuite (ALC-677). Pas de re-examen en centre.”}
]
},
{
id:“faa_airspace”,icon:“🗺️”,title:“Espaces aériens américains”,color:”#f59e0b”,bg:”#130e05”,cours:[
{titre:“Classes d’espaces aériens A B C D E G”,contenu:`Classe A : 18 000ft-60 000ft. Jamais concernée par les drones Part 107 standard.\n\nClasse B : grands aéroports (JFK, LAX, ATL). Sol jusqu'à ~10 000ft. Forme de gâteau renversé. Autorisation ATC obligatoire via LAANC ou FAA DroneZone.\n\nClasse C : aéroports moyens. Sol jusqu'à 4000ft AGL, rayon 5-10 nm. Autorisation ATC requise.\n\nClasse D : petits aéroports avec tour. Jusqu'à ~2500ft AGL, rayon ~4nm. Autorisation ATC requise.\n\nClasse E : espace contrôlé restant. Commence à 1200ft AGL (ou 700ft près des aérodromes). Pas d'autorisation sauf si surface.\n\nClasse G : espace NON contrôlé. Vols drones SANS autorisation. Du sol jusqu'à 1200ft AGL dans la plupart des zones.\n\nMnémotechnique : "Big Clouds Make Dirty Evenings Go" = B, C, D, E, G`},
{titre:“LAANC et zones spéciales”,contenu:`LAANC (Low Altitude Authorization and Notification Capability) : autorisation quasi-instantanée via apps mobiles agréées (AirMap, Aloft). Si votre vol correspond aux grilles prédéfinies, autorisation automatique en quelques secondes.\n\nFAA DroneZone : pour les demandes qui ne peuvent pas être traitées via LAANC. Délai : plusieurs jours à semaines.\n\nApps utiles : B4UFLY, Aloft — vérifient légalité du vol en temps réel.\n\nTFR (Temporary Flight Restrictions) : zones interdites temporaires pour matchs NFL, activités Maison Blanche, urgences. Infraction fédérale grave.\n\nZones spéciales : P (Prohibited/interdit), R (Restricted/réglementé), MOA (Military Operations Area — pas d'autorisation mais prudence).`}
],
quiz:[
{q:“Classe G = espace aérien :”,opts:[“Contrôlé strict”,“Semi-contrôlé”,“Non contrôlé — drones SANS autorisation”,“Réservé militaire”],a:2,exp:“Classe G = espace aérien non contrôlé. Les drones peuvent y opérer librement (sous 400ft, VLOS, etc.) sans autorisation ATC préalable.”},
{q:“LAANC donne une autorisation en :”,opts:[“Quelques secondes”,“24 heures”,“Plusieurs jours”,“Seulement urgences”],a:0,exp:“LAANC = autorisation quasi-instantanée via apps (AirMap, Aloft). Autorisation automatique si le vol correspond aux grilles.”},
{q:“Zone ‘P’ sur carte US = :”,opts:[“Parking”,“Parachutisme”,“Zone interdite absolue”,“Zone militaire possible”],a:2,exp:“P = Prohibited = interdiction absolue. Ex: P-56 autour de la Maison Blanche. Infraction fédérale grave.”},
{q:“MOA nécessite :”,opts:[“Autorisation ATC”,“Contact base militaire”,“Pas d’autorisation mais prudence”,“Waiver FAA”],a:2,exp:“Les MOA ne nécessitent PAS d’autorisation pour les civils, mais vérifiez si active. Aéronefs militaires à haute vitesse possibles.”},
{q:“Classe B entoure :”,opts:[“Tous les aérodromes”,“Petits aérodromes”,“Grands aéroports (JFK, LAX)”,“Zones militaires”],a:2,exp:“Classe B = grands aéroports hub comme JFK, LAX, ATL, ORD. Représentée par cercles concentriques en bleu solide sur les cartes.”}
]
},
{
id:“faa_weather”,icon:“⛅”,title:“Météo FAA — Spécificités américaines”,color:”#06b6d4”,bg:”#051015”,cours:[
{titre:“METAR américaine — Différences clés”,contenu:`Principale différence : la visibilité aux USA est en statute miles (SM), jamais en mètres. 10SM = ~16km. Une visibilité de 1½ SM s'écrit 1 1/2SM.\n\nL'altimètre est en inches of mercury (inHg), pas en hPa. 'A2992' = 29,92 inHg = ~1013 hPa. Pour convertir : multiplier par 33,86.\n\nLa direction du vent est en degrés VRAIS (pas magnétiques). Mnémotechnique : "If it's in print, it must be TRUE."\n\nLa température reste en degrés Celsius. M05 = moins 5°C.\n\nRègle pratique FAA : si visibilité < 3 SM ou plafond < 500ft → ne pas voler.`},
{titre:“Density Altitude — Concept clé FAA”,contenu:`La Density Altitude est l'altitude à laquelle l'atmosphère se comporte réellement. Concept fondamental de l'examen Part 107.\n\nTrois facteurs augmentent la density altitude : haute température, haute altitude, forte humidité. Tous réduisent la densité de l'air.\n\nEffets sur les drones : air moins dense = moins de molécules = hélices moins efficaces = moins de poussée = plus de consommation de batterie. Autonomie réduite de 20-30% à haute density altitude.\n\nExemple : Denver, Colorado (1600m d'altitude) en été avec forte chaleur → le drone se comporte comme s'il était à 2500-3000m en atmosphère standard.\n\nPhénomènes dangereux US : microburst (courant descendant intense d'orage, 5-15min, peut causer un crash instantané), wind shear, turbulence mécanique près des bâtiments.`}
],
quiz:[
{q:”‘10SM’ dans une METAR US = :”,opts:[“10 mètres”,“10 miles nautiques”,“10 miles statutaires (~16km)”,“10 secondes”],a:2,exp:“SM = Statute Miles. Aux USA, visibilité en miles statutaires. 10SM ≈ 16km. En France : 9999 = >10km.”},
{q:”‘A2992’ dans une METAR US = :”,opts:[“Altitude 2992ft”,“Pression 29.92 inHg (~1013 hPa)”,“Vitesse 29.92kt”,“Visibilité 2992m”],a:1,exp:“A = Altimeter setting en inches of mercury. A2992 = 29.92 inHg ≈ 1013 hPa (pression standard ISA).”},
{q:“La density altitude augmente quand :”,opts:[“Il fait froid et sec”,“Altitude basse”,“Chaud + altitude élevée + humidité forte”,“Pression élevée”],a:2,exp:“Haute température + haute altitude + forte humidité = air moins dense = haute density altitude = performances dégradées.”},
{q:“Un microburst est :”,opts:[“Un court vol solo”,“Courant descendant intense pouvant causer un crash”,“Une faible pluie localisée”,“Turbulence de croisière”],a:1,exp:“Le microburst = courant descendant d’orage (jusqu’à 6000ft/min). Durée 5-15min mais extrêmement dangereux.”},
{q:“Direction du vent en METAR US = :”,opts:[“Degrés magnétiques”,“Degrés vrais”,“Radians”,“Points cardinaux”],a:1,exp:“METARs US = degrés VRAIS. Mnémotechnique : ‘if it is in print, it must be true.’”}
]
},
{
id:“faa_vs_dgac”,icon:“⚖️”,title:“FAA vs DGAC — Comparatif complet”,color:”#f43f5e”,bg:”#130508”,cours:[
{titre:“Tableau comparatif FAA vs DGAC/EASA”,contenu:`Altitude max : FAA = 400ft AGL (121m) | EASA = 120m AGL → Pratiquement identique.\n\nLimite masse : FAA < 55 lbs (25kg) | EASA < 25kg → Identique.\n\nExamen : FAA = 60 questions, seuil 70%, 2h, ~175$ | DGAC A2 = 40 questions, seuil 75%, 30min, gratuit.\n\nRenouvellement : FAA = 24 mois, formation en ligne gratuite | DGAC = maintien des compétences requis.\n\nVol de nuit : FAA = autorisé avec éclairage anticollision 3 miles | EASA = généralement restreint.\n\nAssurance RC : FAA = pas d'obligation fédérale | EASA = obligatoire professionnellement.\n\nEnregistrement : FAA = 0,55 lbs (250g), 5$, 3 ans | EASA = 250g, gratuit Alpha Tango.\n\nDéclaration accident : FAA = 10 jours calendaires | DGAC = 72 heures.`},
{titre:“Opérer aux USA avec certification française”,contenu:`La certification DGAC/EASA n'est PAS reconnue aux USA. Pas d'accord de réciprocité EU-USA. Vous devez passer le Part 107 séparément, même avec 10 ans d'expérience DGAC.\n\nVotre formation DGAC est une excellente base. Les matières communes : météorologie, aérodynamique, navigation, sécurité. Les différences à maîtriser : classes d'espaces aériens A-G, cartes Sectional, unités américaines (pieds/miles/inHg), Density Altitude, LAANC.\n\nL'examen Part 107 est en anglais uniquement. La maîtrise du vocabulaire aéronautique anglais est indispensable.\n\nUne fois certifié Part 107, vous pouvez exercer commercialement sur tout le territoire américain. Vos clients (construction, immobilier, agriculture) exigeront systématiquement une preuve de certification.`}
],
quiz:[
{q:“La certification DGAC est-elle reconnue aux USA ?”,opts:[“Oui automatiquement”,“Oui avec justificatif”,“Non, il faut passer le Part 107”,“Oui pour ressortissants EU”],a:2,exp:“Pas de réciprocité EU-USA. La certification DGAC/EASA ne vaut pas aux USA. Vous DEVEZ passer le Part 107 séparément.”},
{q:“Délai déclaration accident FAA vs DGAC :”,opts:[“Identique (72h)”,“FAA=72h, DGAC=10j”,“FAA=10j calendaires, DGAC=72h”,“FAA=24h, DGAC=48h”],a:2,exp:“FAA = 10 jours calendaires. DGAC = 72 heures. Seuils différents aussi : FAA si dommages >500$, DGAC si tiers impliqués.”},
{q:“Examen Part 107 vs DGAC A2 :”,opts:[“Identiques”,“Part 107 = 60q/70% | DGAC = 40q/75%”,“Part 107 = 40q/75% | DGAC = 60q/70%”,“Les deux = 40q/70%”],a:1,exp:“FAA Part 107 : 60 questions, 70% (42/60), 2h, ~175$. DGAC A2 : 40 questions, 75% (30/40), 30min, gratuit.”},
{q:“Vol de nuit Part 107 nécessite :”,opts:[“Waiver obligatoire”,“Éclairage anticollision visible à 3 miles”,“Certificat supplémentaire”,“Co-pilote”],a:1,exp:“Depuis 2021 : vol de nuit autorisé SANS waiver avec éclairage anticollision visible à 3 miles. Autorisation LAANC si espace contrôlé <400ft.”}
]
}
];

// ─── EXAMENS BLANCS ───
const EXAM_DGAC = [
{q:“Règlement européen définissant les règles d’exploitation des drones ?”,opts:[“2019/945”,“2019/947”,“2021/664”,“785/2004”],a:1,cat:“Réglementation”},
{q:“Hauteur max catégorie Ouverte :”,opts:[“50m”,“100m”,“120m”,“150m”],a:2,cat:“Réglementation”},
{q:“Enregistrement Alpha Tango obligatoire dès :”,opts:[“100g”,“250g”,“500g”,“1kg”],a:1,cat:“Réglementation”},
{q:“BKN dans une METAR =”,opts:[“Dégagé”,“Quelques nuages”,“Fragmenté 5-7/8”,“Couvert 8/8”],a:2,cat:“Météo”},
{q:“Givrage : température de risque principal :”,opts:[”-30 à -20°C”,”-10 à +5°C”,”+10 à +20°C”,”>+25°C”],a:1,cat:“Météo”},
{q:“Distance mini sécurité orage :”,opts:[“5km”,“10km”,“20km”,“50km”],a:2,cat:“Météo”},
{q:“Tension minimale cellule LiPo :”,opts:[“2,5V”,“3,0V”,“3,5V”,“3,7V”],a:1,cat:“Aérodynamique”},
{q:“Vortex ring state = :”,opts:[“Vol haute altitude”,“Descente rapide à faible vitesse horizontale”,“Décollage vent fort”,“Virages serrés”],a:1,cat:“Aérodynamique”},
{q:“Formule du GSD :”,opts:[“Focale×Photosite/Altitude”,“Altitude×Photosite/Focale”,“Altitude×Focale/Photosite”,“Photosite/(Altitude×Focale)”],a:1,cat:“Photogrammétrie”},
{q:“Overlap longitudinal recommandé :”,opts:[“20-30%”,“40-50%”,“70-80%”,“95-100%”],a:2,cat:“Photogrammétrie”},
{q:“Lambert 93 = EPSG :”,opts:[“4326”,“2154”,“32631”,“4230”],a:1,cat:“Photogrammétrie”},
{q:“MNT représente :”,opts:[“Surface complète”,“Sol nu uniquement”,“Végétation seule”,“Bâtiments seuls”],a:1,cat:“Photogrammétrie”},
{q:“GRC dans SORA = :”,opts:[“Ground Risk Class”,“General Risk Control”,“GPS Reference”,“Ground Regulation”],a:0,cat:“Sécurité”},
{q:“SAIL peut aller de :”,opts:[“0 à 3”,“1 à 4”,“1 à 6”,“0 à 10”],a:2,cat:“Sécurité”},
{q:“Délai déclaration accident DGAC :”,opts:[“24h”,“48h”,“72h”,“7 jours”],a:2,cat:“Réglementation”},
{q:“STS-01 couvre :”,opts:[“BVLOS zones peu peuplées”,“VLOS zones habitées”,“Vol de nuit”,“Au-dessus de 120m”],a:1,cat:“Réglementation”},
{q:“QNH = :”,opts:[“Vitesse vent en nœuds”,“Pression atmosphérique niveau mer”,“Direction vent”,“Température au sol”],a:1,cat:“Météo”},
{q:“Tension stockage idéale LiPo :”,opts:[“3,0V/cellule”,“3,7V/cellule”,“3,8V/cellule”,“4,2V/cellule”],a:2,cat:“Aérodynamique”},
{q:“PPK vs RTK : différence principale :”,opts:[“PPK moins précis”,“PPK=correction post-vol sans liaison radio”,“PPK=plus de GCPs”,“PPK utilise Wi-Fi”],a:1,cat:“Photogrammétrie”},
{q:“Minimum GCPs zone rectangulaire :”,opts:[“3”,“4”,“5”,“10”],a:2,cat:“Photogrammétrie”},
];
const EXAM_FAA = [
{q:“Hauteur max Part 107 sans structure :”,opts:[“300ft AGL”,“400ft AGL”,“500ft AGL”,“1000ft AGL”],a:1,cat:“Réglementation”},
{q:“Seuil réussite examen Part 107 :”,opts:[“60%”,“70%”,“75%”,“80%”],a:1,cat:“Réglementation”},
{q:“Classe aérien sans autorisation pour drones :”,opts:[“Classe B”,“Classe C”,“Classe D”,“Classe G”],a:3,cat:“Espace aérien”},
{q:“LAANC = autorisation en :”,opts:[“Plusieurs jours”,“Quasi-instantanée”,“24h”,“Seulement urgences”],a:1,cat:“Espace aérien”},
{q:”‘10SM’ dans METAR US = :”,opts:[“10 mètres”,“10 miles nautiques”,“10 miles statutaires”,“10 secondes”],a:2,cat:“Météo”},
{q:“Density altitude augmente avec :”,opts:[“Froid et altitude basse”,“Chaud + altitude élevée + humidité”,“Basse pression seule”,“Froid sec”],a:1,cat:“Météo”},
{q:“Vitesse max Part 107 :”,opts:[“50 mph”,“75 mph”,“100 mph / 87kt”,“120 kt”],a:2,cat:“Réglementation”},
{q:“Dégagement horizontal minimum nuages :”,opts:[“500ft”,“1000ft”,“2000ft”,“3000ft”],a:2,cat:“Météo”},
{q:“Zone ‘P’ carte US = :”,opts:[“Parking”,“Parachutisme”,“Zone interdite absolue”,“Zone militaire possible”],a:2,cat:“Espace aérien”},
{q:“Remote Pilot Certificate valide :”,opts:[“12 mois”,“24 mois”,“36 mois”,“À vie”],a:1,cat:“Réglementation”},
{q:“Délai déclaration accident FAA :”,opts:[“24h”,“72h”,“10 jours calendaires”,“30 jours”],a:2,cat:“Réglementation”},
{q:“BVLOS signifie :”,opts:[“Battery Very Low”,“Beyond Visual Line of Sight”,“Basic Visual Landing”,“Bureau Validation Licensing”],a:1,cat:“Réglementation”},
{q:“Direction vent METAR US = :”,opts:[“Degrés magnétiques”,“Degrés vrais”,“Radians”,“Points cardinaux”],a:1,cat:“Météo”},
{q:“Grands aéroports US (JFK, LAX) = Classe :”,opts:[“C”,“D”,“B”,“E”],a:2,cat:“Espace aérien”},
{q:“Certification DGAC reconnue aux USA ?”,opts:[“Oui automatiquement”,“Oui avec justificatif”,“Non, Part 107 obligatoire”,“Oui pour EU”],a:2,cat:“Comparatif”},
{q:“Vol de nuit Part 107 nécessite :”,opts:[“Waiver obligatoire”,“Éclairage anticollision 3 miles”,“Certificat supplémentaire”,“Co-pilote”],a:1,cat:“Réglementation”},
{q:“Enregistrement FAA drones commerciaux dès :”,opts:[“0g”,“0,55 lb (250g)”,“2,2 lb (1kg)”,“55 lb (25kg)”],a:1,cat:“Réglementation”},
{q:“MOA Military Operations Area : drones :”,opts:[“Autorisation ATC obligatoire”,“Clearance base militaire”,“Pas d’autorisation mais prudence”,“Waiver FAA”],a:2,cat:“Espace aérien”},
{q:”‘A2992’ METAR US = :”,opts:[“Altitude 2992ft”,“Pression 29.92 inHg (~1013 hPa)”,“Vitesse 29.92kt”,“Visibilité 2992m”],a:1,cat:“Météo”},
{q:“Coût enregistrement FAA drone :”,opts:[“Gratuit”,“5$ / 3 ans”,“175$”,“50$ / an”],a:1,cat:“Réglementation”},
];

function shuffle(a){return […a].sort(()=>Math.random()-.5);}

export default function App() {
const [screen,setScreen]=useState(“home”);
const [examType,setExamType]=useState(“dgac”);
const [activeMod,setActiveMod]=useState(null);
const [coursIdx,setCoursIdx]=useState(0);
const [speaking,setSpeaking]=useState(false);
const [qIdx,setQIdx]=useState(0);
const [qSel,setQSel]=useState(null);
const [qScore,setQScore]=useState(0);
const [qDone,setQDone]=useState(false);
const [examQs,setExamQs]=useState([]);
const [examIdx,setExamIdx]=useState(0);
const [examSel,setExamSel]=useState(null);
const [examAnswers,setExamAnswers]=useState([]);
const [examDone,setExamDone]=useState(false);
const [examTime,setExamTime]=useState(1800);
const [progress,setProgress]=useState({});
const synthRef=useRef(null);
const timerRef=useRef(null);

useEffect(()=>{
synthRef.current=window.speechSynthesis;
try{const s=localStorage.getItem(“prog”);if(s)setProgress(JSON.parse(s));}catch(e){}
return()=>{if(synthRef.current)synthRef.current.cancel();if(timerRef.current)clearInterval(timerRef.current);};
},[]);

const speak=(text)=>{
if(!synthRef.current)return;
synthRef.current.cancel();
const u=new SpeechSynthesisUtterance(text);
u.lang=“fr-FR”;u.rate=0.91;
const voices=synthRef.current.getVoices();
const fr=voices.find(v=>v.lang.startsWith(“fr”));
if(fr)u.voice=fr;
u.onstart=()=>setSpeaking(true);
u.onend=u.onerror=()=>setSpeaking(false);
synthRef.current.speak(u);
};
const stopSpeak=()=>{if(synthRef.current)synthRef.current.cancel();setSpeaking(false);};

const saveProg=(key,val)=>{
setProgress(p=>{const n={…p,[key]:val};try{localStorage.setItem(“prog”,JSON.stringify(n));}catch(e){}return n;});
};

const openMod=(mod)=>{
stopSpeak();setActiveMod(mod);setCoursIdx(0);
setQIdx(0);setQSel(null);setQScore(0);setQDone(false);
setScreen(“module”);
};

const startExam=(type)=>{
const pool=type===“faa”?EXAM_FAA:EXAM_DGAC;
const qs=shuffle(pool);
setExamType(type);setExamQs(qs);setExamIdx(0);setExamSel(null);
setExamAnswers([]);setExamDone(false);setExamTime(type===“faa”?7200:1800);
setScreen(“exam”);
if(timerRef.current)clearInterval(timerRef.current);
timerRef.current=setInterval(()=>setExamTime(t=>{
if(t<=1){clearInterval(timerRef.current);setExamDone(true);return 0;}
return t-1;
}),1000);
};

const handleExamAnswer=(i)=>{
if(examSel!==null)return;
setExamSel(i);
setExamAnswers(a=>[…a,{correct:i===examQs[examIdx].a,cat:examQs[examIdx].cat}]);
};

const nextExam=()=>{
if(examIdx+1>=examQs.length){clearInterval(timerRef.current);setExamDone(true);}
else{setExamIdx(i=>i+1);setExamSel(null);}
};

const handleQuizAnswer=(i)=>{
if(qSel!==null)return;
setQSel(i);
if(i===activeMod.quiz[qIdx].a)setQScore(s=>s+1);
};

const nextQuiz=()=>{
if(qIdx+1>=activeMod.quiz.length){
const pct=Math.round(((qScore+(qSel===activeMod.quiz[qIdx].a?1:0))/activeMod.quiz.length)*100);
saveProg(activeMod.id,pct);setQDone(true);
}else{setQIdx(i=>i+1);setQSel(null);}
};

const fmtTime=(s)=>{
const h=Math.floor(s/3600);
const m=Math.floor((s%3600)/60);
const sec=s%60;
if(h>0)return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
};

const allMods=[…MODULES,…FAA_MODULES];
const totalDone=allMods.filter(m=>progress[m.id]>=70).length;
const mod=activeMod;
const c=mod?mod.cours[coursIdx]:null;
const q=mod&&!qDone?mod.quiz[qIdx]:null;
const eq=examQs[examIdx];
const examThreshold=examType===“faa”?70:75;
const examLabel=examType===“faa”?“FAA Part 107”:“DGAC”;

return (
<div style={{minHeight:“100vh”,background:”#08090e”,color:”#ddd”}}>
<style>{G}</style>

```
  {/* ── HOME ── */}
  {screen==="home"&&(
    <div>
      <div style={{background:"linear-gradient(160deg,#0c1020,#08090e)",padding:"56px 24px 44px",textAlign:"center",borderBottom:"1px solid #131825",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 40% at 50% 0%,rgba(0,180,216,0.06),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{font:"12px 'JetBrains Mono',monospace",color:"#00b4d8",letterSpacing:4,marginBottom:14}}>FORMATION PROFESSIONNELLE COMPLÈTE</div>
          <h1 style={{font:"800 clamp(26px,5vw,48px)/1.1 'Exo 2',sans-serif",color:"#fff",marginBottom:8}}>
            Télépilote <span style={{color:"#00b4d8"}}>Drone</span>
          </h1>
          <p style={{font:"14px 'DM Sans',sans-serif",color:"#556",maxWidth:480,margin:"0 auto 28px"}}>
            Formation complète 🇫🇷 DGAC/EASA + 🇺🇸 FAA Part 107 · Cours vocaux · Quiz · Examens blancs
          </p>
          <div style={{display:"flex",gap:28,justifyContent:"center",flexWrap:"wrap",marginBottom:36}}>
            {[["9",`modules`],["40+","leçons vocales"],["120+","questions"],[(totalDone+"/"+allMods.length),"complétés"]].map(([n,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{font:"800 28px 'Exo 2',sans-serif",color:n.includes("/")?((totalDone===allMods.length)?"#06d6a0":"#f4a261"):"#00b4d8"}}>{n}</div>
                <div style={{font:"10px 'JetBrains Mono',monospace",color:"#334",letterSpacing:2,marginTop:2}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn" style={{background:"linear-gradient(135deg,#e94560,#c73652)",color:"#fff",fontSize:14,padding:"13px 28px"}} onClick={()=>startExam("dgac")}>
              🎓 Examen blanc DGAC — 20q
            </button>
            <button className="btn" style={{background:"linear-gradient(135deg,#1d4ed8,#1e40af)",color:"#fff",fontSize:14,padding:"13px 28px"}} onClick={()=>startExam("faa")}>
              🇺🇸 Examen blanc FAA Part 107 — 20q
            </button>
          </div>
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"40px 20px"}}>
        <div style={{font:"11px 'JetBrains Mono',monospace",color:"#334",letterSpacing:3,marginBottom:6}}>🇫🇷 FORMATION DGAC / EASA</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:32}}>
          {MODULES.map((m,idx)=>{
            const done=progress[m.id];
            return(
              <div key={m.id} className="fadein" onClick={()=>openMod(m)} style={{animationDelay:idx*0.05+"s",cursor:"pointer",borderRadius:12,padding:"20px",background:"#0d0f18",border:`1px solid ${done>=75?m.color+"40":"#1a1f2e"}`,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"88";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 6px 20px ${m.color}15`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=done>=75?m.color+"40":"#1a1f2e";e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:30}}>{m.icon}</span>
                  {done!==undefined&&<span className="pill" style={{background:done>=75?"#06d6a018":"#1a2030",color:done>=75?"#06d6a0":"#446",border:`1px solid ${done>=75?"#06d6a030":"#2a3040"}`}}>{done>=75?"✓ ":""}{done}%</span>}
                </div>
                <div style={{font:"700 15px 'Exo 2',sans-serif",color:"#eee",marginBottom:3}}>{m.title}</div>
                <div style={{font:"12px 'DM Sans',sans-serif",color:"#446",marginBottom:10}}>{m.niveau} · {m.duree}</div>
                <div style={{display:"flex",gap:6}}>
                  <span className="pill" style={{background:m.color+"15",color:m.color,border:`1px solid ${m.color}28`}}>🎧 {m.cours.length} leçons</span>
                  <span className="pill" style={{background:"#141820",color:"#556",border:"1px solid #2a3040"}}>✏️ {m.quiz.length} quiz</span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{font:"11px 'JetBrains Mono',monospace",color:"#334",letterSpacing:3,marginBottom:6}}>🇺🇸 FORMATION FAA PART 107 — EN FRANÇAIS</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {FAA_MODULES.map((m,idx)=>{
            const done=progress[m.id];
            return(
              <div key={m.id} className="fadein" onClick={()=>openMod(m)} style={{animationDelay:idx*0.05+"s",cursor:"pointer",borderRadius:12,padding:"20px",background:"#0d0f18",border:`1px solid ${done>=70?m.color+"40":"#1a1f2e"}`,transition:"all .2s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=m.color+"88";e.currentTarget.style.transform="translateY(-2px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=done>=70?m.color+"40":"#1a1f2e";e.currentTarget.style.transform="";}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <span style={{fontSize:30}}>{m.icon}</span>
                  {done!==undefined&&<span className="pill" style={{background:done>=70?"#06d6a018":"#1a2030",color:done>=70?"#06d6a0":"#446",border:`1px solid ${done>=70?"#06d6a030":"#2a3040"}`}}>{done>=70?"✓ ":""}{done}%</span>}
                </div>
                <div style={{font:"700 15px 'Exo 2',sans-serif",color:"#eee",marginBottom:3}}>{m.title}</div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <span className="pill" style={{background:m.color+"15",color:m.color,border:`1px solid ${m.color}28`}}>🎧 {m.cours.length} leçons</span>
                  <span className="pill" style={{background:"#141820",color:"#556",border:"1px solid #2a3040"}}>✏️ {m.quiz.length} quiz</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}

  {/* ── MODULE ── */}
  {screen==="module"&&mod&&(
    <div style={{maxWidth:700,margin:"0 auto",padding:"32px 20px"}}>
      <button className="back" onClick={()=>{stopSpeak();setScreen("home");}}>← ACCUEIL</button>
      <div style={{marginTop:24,marginBottom:28,borderBottom:`1px solid ${mod.color}20`,paddingBottom:24}}>
        <div style={{fontSize:40,marginBottom:10}}>{mod.icon}</div>
        <h1 style={{font:"800 26px 'Exo 2',sans-serif",color:"#fff",marginBottom:10}}>{mod.title}</h1>
        <div style={{font:"11px 'JetBrains Mono',monospace",color:mod.color,letterSpacing:2}}>{mod.cours.length} LEÇONS · {mod.quiz.length} QUESTIONS</div>
      </div>
      <div style={{marginBottom:24}}>
        {mod.cours.map((c,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"11px 15px",borderRadius:8,marginBottom:6,background:"#0e1018",border:`1px solid ${mod.color}18`}}>
            <span style={{font:"600 11px 'JetBrains Mono',monospace",color:mod.color,minWidth:22}}>{String(i+1).padStart(2,"0")}</span>
            <span style={{font:"13px 'DM Sans',sans-serif",color:"#aaa"}}>{c.titre}</span>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[{icon:"🎧",t:"Cours vocal",s:"Écoute en français",fn:()=>setScreen("cours"),col:mod.color},
          {icon:"✏️",t:"Quiz",s:"Teste tes connaissances",fn:()=>{setQIdx(0);setQSel(null);setQScore(0);setQDone(false);setScreen("quiz");},col:"#446"}
        ].map(a=>(
          <div key={a.t} onClick={a.fn} style={{cursor:"pointer",borderRadius:12,padding:"20px 18px",background:"#0e1018",border:`1px solid ${a.col}35`,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=a.col;e.currentTarget.style.boxShadow=`0 4px 16px ${a.col}15`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=a.col+"35";e.currentTarget.style.boxShadow="";}}>
            <div style={{fontSize:28,marginBottom:8}}>{a.icon}</div>
            <div style={{font:"700 14px 'Exo 2',sans-serif",color:"#ddd",marginBottom:4}}>{a.t}</div>
            <div style={{font:"12px 'DM Sans',sans-serif",color:"#446"}}>{a.s}</div>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* ── COURS ── */}
  {screen==="cours"&&mod&&c&&(
    <div style={{minHeight:"100vh",background:mod.bg}}>
      <div style={{height:3,background:"#1a2030"}}><div style={{height:"100%",background:mod.color,width:`${((coursIdx+1)/mod.cours.length)*100}%`,transition:"width .5s",boxShadow:`0 0 8px ${mod.color}`}}/></div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:22}}>
          <button className="back" onClick={()=>{stopSpeak();setScreen("module");}}>← {mod.title.slice(0,20).toUpperCase()}</button>
          <span style={{font:"12px 'JetBrains Mono',monospace",color:"#334"}}>{coursIdx+1}/{mod.cours.length}</span>
        </div>
        <span className="pill" style={{background:mod.color+"18",color:mod.color,border:`1px solid ${mod.color}28`,marginBottom:12,display:"inline-block"}}>LEÇON {String(coursIdx+1).padStart(2,"0")}</span>
        <h2 style={{font:"800 clamp(17px,3.5vw,24px)/1.3 'Exo 2',sans-serif",color:"#fff",marginTop:8,marginBottom:24}}>{c.titre}</h2>
        <div style={{background:"#0c0e16",border:`1px solid ${mod.color}20`,borderRadius:14,padding:"20px",marginBottom:20,textAlign:"center"}}>
          <div style={{height:26,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,gap:2}}>
            {speaking?[.5,.8,1,.7,.9,.6,1,.8,.5,.9,.7,1,.6,.8].map((h,i)=><span key={i} className="wave" style={{height:`${h*24}px`,background:mod.color,animationDelay:`${i*.07}s`}}/>):Array(14).fill(0).map((_,i)=><span key={i} style={{display:"inline-block",width:3,height:7,background:"#1e2535",borderRadius:2,margin:"0 1.5px"}}/>)}
          </div>
          <button onClick={()=>speaking?stopSpeak():speak(c.contenu)} style={{cursor:"pointer",width:58,height:58,borderRadius:"50%",border:`2px solid ${mod.color}`,background:speaking?mod.color:"transparent",color:speaking?"#000":mod.color,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",transition:"all .2s",boxShadow:speaking?`0 0 20px ${mod.color}40`:"none"}}>
            {speaking?"⏹":"▶"}
          </button>
          <div style={{font:"10px 'JetBrains Mono',monospace",color:"#334",letterSpacing:2,marginTop:8}}>{speaking?"EN LECTURE":"ÉCOUTER EN FRANÇAIS"}</div>
        </div>
        <div style={{background:"#0c0e16",border:"1px solid #1a2030",borderRadius:12,padding:"18px 22px",lineHeight:2,fontSize:14,color:"#99a",whiteSpace:"pre-line",maxHeight:300,overflowY:"auto",marginBottom:24}}>{c.contenu}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button className="btn" style={{background:coursIdx>0?"#141820":"transparent",color:coursIdx>0?"#888":"#222",border:`1px solid ${coursIdx>0?"#2a3040":"transparent"}`}} disabled={coursIdx===0} onClick={()=>{stopSpeak();setCoursIdx(i=>i-1);}}>← Précédent</button>
          <div style={{display:"flex",gap:5}}>{mod.cours.map((_,i)=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:i===coursIdx?mod.color:"#1e2535",transition:"all .2s"}}/>)}</div>
          <button className="btn" style={{background:mod.color,color:"#000",fontWeight:700}} onClick={()=>{stopSpeak();if(coursIdx+1<mod.cours.length)setCoursIdx(i=>i+1);else setScreen("module");}}>{coursIdx+1>=mod.cours.length?"Fin →":"Suivant →"}</button>
        </div>
        {coursIdx+1>=mod.cours.length&&(
          <div style={{marginTop:18,textAlign:"center",padding:"16px",background:"#0c0e16",borderRadius:10,border:"1px solid #1e2535"}}>
            <p style={{color:"#668",fontSize:13,marginBottom:10}}>Module terminé ! Lance le quiz.</p>
            <button className="btn" style={{background:mod.color,color:"#000",fontWeight:700}} onClick={()=>{setQIdx(0);setQSel(null);setQScore(0);setQDone(false);setScreen("quiz");}}>✏️ QUIZ →</button>
          </div>
        )}
      </div>
    </div>
  )}

  {/* ── QUIZ ── */}
  {screen==="quiz"&&mod&&(
    <div style={{minHeight:"100vh",background:mod.bg}}>
      {!qDone?(
        <>
          <div style={{height:3,background:"#1a2030"}}><div style={{height:"100%",background:mod.color,width:`${(qIdx/mod.quiz.length)*100}%`,transition:"width .4s"}}/></div>
          <div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
              <button className="back" onClick={()=>setScreen("module")}>← MODULE</button>
              <span style={{font:"12px 'JetBrains Mono',monospace",color:"#334"}}>{qIdx+1}/{mod.quiz.length}</span>
            </div>
            <div style={{background:"#0c0e16",borderLeft:`4px solid ${mod.color}`,borderRadius:"0 10px 10px 0",padding:"16px 20px",marginBottom:20,font:"500 clamp(14px,2.5vw,16px)/1.7 'DM Sans',sans-serif",color:"#e0e4f0"}}>{q.q}</div>
            {q.opts.map((opt,i)=>{
              let cls="opt";
              if(qSel!==null){if(i===q.a)cls+=" opt-ok";else if(i===qSel)cls+=" opt-no";}
              return<button key={i} className={cls} disabled={qSel!==null} onClick={()=>handleQuizAnswer(i)} style={{"--acc":mod.color}}><span style={{font:"600 11px 'JetBrains Mono',monospace",color:mod.color,marginRight:10}}>{["A","B","C","D"][i]}.</span>{opt}</button>;
            })}
            {qSel!==null&&(
              <div style={{marginTop:10,padding:"13px 17px",borderRadius:8,background:qSel===q.a?"rgba(6,214,160,0.07)":"rgba(233,69,96,0.07)",border:`1px solid ${qSel===q.a?"#06d6a030":"#e9456030"}`,font:"13px/1.7 'DM Sans',sans-serif",marginBottom:14}}>
                <span style={{font:"600 10px 'JetBrains Mono',monospace",color:qSel===q.a?"#06d6a0":"#e94560"}}>{qSel===q.a?"✓ CORRECT — ":"✗ INCORRECT — "}</span>{q.exp}
              </div>
            )}
            {qSel!==null&&<div style={{textAlign:"right"}}><button className="btn" style={{background:mod.color,color:"#000",fontWeight:700}} onClick={nextQuiz}>{qIdx+1>=mod.quiz.length?"RÉSULTATS →":"SUIVANT →"}</button></div>}
          </div>
        </>
      ):(
        <div style={{maxWidth:500,margin:"0 auto",padding:"60px 20px",textAlign:"center"}}>
          <div style={{font:"800 68px/1 'Exo 2',sans-serif",color:mod.color,marginBottom:6}}>{Math.round((qScore/mod.quiz.length)*100)}%</div>
          <div style={{font:"700 13px 'JetBrains Mono',monospace",color:mod.color,letterSpacing:3,marginBottom:6}}>{qScore>=mod.quiz.length*.75?"EXCELLENT ✓":qScore>=mod.quiz.length*.5?"À REVOIR":"INSUFFISANT"}</div>
          <div style={{color:"#445",fontSize:13,marginBottom:32}}>{qScore}/{mod.quiz.length} bonnes réponses</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
            <button className="btn" style={{background:mod.color,color:"#000",fontWeight:700}} onClick={()=>{setQIdx(0);setQSel(null);setQScore(0);setQDone(false);}}>↻ Recommencer</button>
            <button className="btn" style={{background:"#141820",border:"1px solid #2a3040",color:"#668"}} onClick={()=>setScreen("home")}>← Accueil</button>
          </div>
        </div>
      )}
    </div>
  )}

  {/* ── EXAMEN BLANC ── */}
  {screen==="exam"&&(
    <div style={{minHeight:"100vh",background:"#08090e"}}>
      {!examDone?(
        <>
          <div style={{background:"#0c0d14",borderBottom:"1px solid #1a2030",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
            <div style={{font:"700 12px 'JetBrains Mono',monospace",color:examType==="faa"?"#3b82f6":"#e94560"}}>
              {examType==="faa"?"🇺🇸 EXAMEN FAA PART 107":"🇫🇷 EXAMEN DGAC"}
            </div>
            <div style={{display:"flex",gap:18,alignItems:"center"}}>
              <span style={{font:"600 13px 'JetBrains Mono',monospace",color:examTime<300?"#e94560":"#06d6a0"}}>⏱ {fmtTime(examTime)}</span>
              <span style={{font:"12px 'JetBrains Mono',monospace",color:"#334"}}>{examIdx+1}/{examQs.length}</span>
            </div>
          </div>
          <div style={{height:3,background:"#1a2030"}}><div style={{height:"100%",background:examType==="faa"?"#3b82f6":"#e94560",width:`${(examIdx/examQs.length)*100}%`,transition:"width .4s"}}/></div>
          <div style={{maxWidth:700,margin:"0 auto",padding:"28px 20px"}}>
            <span className="pill" style={{background:"#1a2030",color:"#556",border:"1px solid #2a3040",marginBottom:16,display:"inline-block"}}>📂 {eq?.cat}</span>
            <div style={{background:"#0c0e16",borderLeft:`4px solid ${examType==="faa"?"#3b82f6":"#e94560"}`,borderRadius:"0 10px 10px 0",padding:"16px 20px",marginBottom:20,font:"500 clamp(14px,2.5vw,16px)/1.7 'DM Sans',sans-serif",color:"#e0e4f0",marginTop:12}}>{eq?.q}</div>
            {eq?.opts.map((opt,i)=>{
              let cls="opt";
              if(examSel!==null){if(i===eq.a)cls+=" opt-ok";else if(i===examSel)cls+=" opt-no";}
              const acc=examType==="faa"?"#3b82f6":"#e94560";
              return<button key={i} className={cls} disabled={examSel!==null} onClick={()=>handleExamAnswer(i)} style={{"--acc":acc}}><span style={{font:"600 11px 'JetBrains Mono',monospace",color:acc,marginRight:10}}>{["A","B","C","D"][i]}.</span>{opt}</button>;
            })}
            {examSel!==null&&(
              <>
                <div style={{marginTop:10,padding:"13px 17px",borderRadius:8,background:examSel===eq?.a?"rgba(6,214,160,0.07)":"rgba(233,69,96,0.07)",border:`1px solid ${examSel===eq?.a?"#06d6a030":"#e9456030"}`,font:"13px/1.7 'DM Sans',sans-serif",marginBottom:14}}>
                  <span style={{font:"600 10px 'JetBrains Mono',monospace",color:examSel===eq?.a?"#06d6a0":"#e94560"}}>{examSel===eq?.a?"✓ CORRECT":"✗ INCORRECT"}</span>
                  {" — "}<strong style={{color:"#e0e4f0"}}>{eq?.opts[eq?.a]}</strong>
                </div>
                <div style={{textAlign:"right"}}><button className="btn" style={{background:examType==="faa"?"#3b82f6":"#e94560",color:"#fff",fontWeight:700}} onClick={nextExam}>{examIdx+1>=examQs.length?"RÉSULTATS →":"SUIVANT →"}</button></div>
              </>
            )}
          </div>
        </>
      ):(
        <div style={{maxWidth:680,margin:"0 auto",padding:"48px 20px"}}>
          {(()=>{
            const total=examAnswers.filter(a=>a.correct).length;
            const pct=Math.round((total/examQs.length)*100);
            const pass=pct>=examThreshold;
            const cats=[...new Set(examAnswers.map(a=>a.cat))];
            return(
              <>
                <div style={{textAlign:"center",marginBottom:40}}>
                  <div style={{font:"800 80px/1 'Exo 2',sans-serif",color:pass?"#06d6a0":"#e94560",textShadow:`0 0 50px ${pass?"#06d6a0":"#e94560"}40`,marginBottom:8}}>{pct}%</div>
                  <div style={{font:"700 15px 'JetBrains Mono',monospace",letterSpacing:4,color:pass?"#06d6a0":"#e94560",marginBottom:6}}>{examLabel} — {pass?"✓ ADMIS":"✗ AJOURNÉ"}</div>
                  <div style={{color:"#445",fontSize:13,marginBottom:4}}>{total}/{examQs.length} · Seuil : {examThreshold}% ({Math.ceil(examQs.length*examThreshold/100)} bonnes réponses)</div>
                  <div style={{color:"#334",fontSize:12}}>Temps restant : {fmtTime(examTime)}</div>
                </div>
                <div style={{marginBottom:32}}>
                  <div style={{font:"11px 'JetBrains Mono',monospace",color:"#334",letterSpacing:2,marginBottom:14}}>RÉSULTATS PAR THÈME</div>
                  {cats.map(cat=>{
                    const ca=examAnswers.filter(a=>a.cat===cat);
                    const p=Math.round((ca.filter(a=>a.correct).length/ca.length)*100);
                    return(
                      <div key={cat} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,background:"#0c0e16",padding:"10px 16px",borderRadius:8,border:"1px solid #1a2030"}}>
                        <div style={{flex:1,font:"500 13px 'DM Sans',sans-serif",color:"#aaa"}}>{cat}</div>
                        <div style={{width:100,height:5,background:"#1a2030",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${p}%`,background:p>=examThreshold?"#06d6a0":"#e94560",borderRadius:3}}/></div>
                        <div style={{font:"600 12px 'JetBrains Mono',monospace",color:p>=examThreshold?"#06d6a0":"#e94560",minWidth:38,textAlign:"right"}}>{p}%</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="btn" style={{background:examType==="faa"?"#3b82f6":"#e94560",color:"#fff",fontWeight:700}} onClick={()=>startExam(examType)}>↻ Nouvel examen</button>
                  <button className="btn" style={{background:examType==="faa"?"#e94560":"#3b82f6",color:"#fff"}} onClick={()=>startExam(examType==="faa"?"dgac":"faa")}>
                    {examType==="faa"?"🇫🇷 Examen DGAC":"🇺🇸 Examen FAA"}
                  </button>
                  <button className="btn" style={{background:"#141820",border:"1px solid #2a3040",color:"#668"}} onClick={()=>setScreen("home")}>← Accueil</button>
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  )}
</div>
```

);
}
