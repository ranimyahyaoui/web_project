import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'node:url';
import { prisma } from '../lib/prisma.js';

export const ACADEMIC_YEAR = '2026-2027';
export const MEMBERSHIP_FEE = 20;
export const DEMO = {
  member: { email: 'yasmine.trabelsi@supcom.tn', password: 'membre123' },
  admin: { email: 'youssef.ayari@supcom.tn', password: 'admin123' },
};

const FIRST = [
  'Omar',
  'Lina',
  'Hamza',
  'Mariem',
  'Wassim',
  'Eya',
  'Aziz',
  'Nour',
  'Skander',
  'Rania',
];
const LAST = [
  'Nasri',
  'Bouazizi',
  'Karray',
  'Sfar',
  'Dridi',
  'Mabrouk',
  'Jlassi',
];
const LEVELS = [
  '1re année Tronc commun',
  '2e année Télécom',
  '2e année Informatique',
  '3e année Réseaux',
  '3e année Télécom',
];
const POLES = [
  'Développement web',
  'Cybersécurité',
  'IA & data',
  'Électronique & IoT',
];
const BOARD = [
  ['Amine Gharbi', 'Président', 'Représente le club et coordonne le bureau.'],
  [
    'Sarra Mejri',
    'Vice-présidente',
    'Partenariats et relations avec l’administration.',
  ],
  [
    'Ines Haddad',
    'Secrétaire générale',
    'Adhésions, comptes rendus et communication interne.',
  ],
  ['Youssef Ayari', 'Trésorier', 'Cotisations, budget et suivi des paiements.'],
  [
    'Mehdi Ben Salah',
    'Responsable développement web',
    'Workshops et formations du pôle web.',
  ],
  [
    'Nesrine Jaziri',
    'Responsable cybersécurité',
    'CTF, veille et ateliers de sécurité.',
  ],
  [
    'Rami Chaabane',
    'Responsable IA & data',
    'Formations Python et projets de données.',
  ],
  [
    'Khalil Mansour',
    'Responsable électronique & IoT',
    'Ateliers matériels et prêt des cartes.',
  ],
];

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toIsoDate(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function referenceSaturday() {
  let date = addDays(new Date(), 2);
  while (date.getDay() !== 6) date = addDays(date, 1);
  return date;
}

function weekly(start, count) {
  return Array.from({ length: count }, (_, index) =>
    toIsoDate(addDays(start, index * 7)),
  );
}

function getActivities(base) {
  const reactStart = addDays(base, -17);
  const pythonStart = addDays(base, 35);
  return [
    {
      slug: 'git-github',
      type: 'workshop',
      pole: 'Développement web',
      taken: 18,
      capacity: 30,
      title: 'Git & GitHub : collaborer sans conflits',
      summary:
        'Travailler à plusieurs sur le même code sans perdre son travail.',
      description:
        'Un atelier pratique pour apprendre à travailler à plusieurs sur le même code sans perdre son travail. Vous repartirez avec un dépôt GitHub configuré et les bons réflexes pour vos projets d’équipe.',
      date: toIsoDate(base),
      startTime: '14h00',
      endTime: '17h00',
      location: 'Salle B12, bâtiment B',
      level: 'Niveau débutant',
      duration: '3 heures',
      bring: 'Ordinateur portable',
      outcomes: [
        'Créer un dépôt et faire vos premiers commits',
        'Travailler avec des branches',
        'Ouvrir et relire une pull request',
        'Résoudre un conflit de fusion',
      ],
    },
    {
      slug: 'initiation-ctf',
      type: 'workshop',
      pole: 'Cybersécurité',
      taken: 31,
      capacity: 40,
      title: 'Initiation CTF : vos premiers challenges',
      summary:
        'Découvrir les compétitions de sécurité en résolvant de vrais challenges.',
      description:
        'Une matinée pour découvrir les compétitions « Capture The Flag ». Par équipes de trois, vous résolvez des challenges de web, de cryptographie et de forensic, guidés par les membres du pôle.',
      date: toIsoDate(addDays(base, 7)),
      startTime: '10h00',
      endTime: '13h00',
      location: 'Labo réseaux',
      level: 'Niveau débutant',
      duration: '3 heures',
      bring: 'Ordinateur portable avec une machine virtuelle Kali',
      outcomes: [
        'Comprendre le format d’un CTF',
        'Exploiter une faille web simple',
        'Déchiffrer un message codé',
        'Travailler en équipe sous contrainte de temps',
      ],
    },
    {
      slug: 'capteurs-esp32',
      type: 'workshop',
      pole: 'Électronique & IoT',
      taken: 13,
      capacity: 20,
      title: 'Capteurs connectés avec l’ESP32',
      summary:
        'Monter un capteur de température et publier ses mesures en ligne.',
      description:
        'Vous câblez un capteur sur une carte ESP32, vous la programmez et vous envoyez les mesures vers un tableau de bord en ligne. Le matériel est fourni par le club.',
      date: toIsoDate(addDays(base, 14)),
      startTime: '09h30',
      endTime: '12h30',
      location: 'Labo électronique',
      level: 'Niveau intermédiaire',
      duration: '3 heures',
      bring: 'Ordinateur portable et câble USB',
      outcomes: [
        'Câbler un capteur sur une carte',
        'Programmer l’ESP32',
        'Envoyer des données en Wi-Fi',
        'Afficher les mesures en temps réel',
      ],
    },
    {
      slug: 'react-a-z',
      type: 'formation',
      pole: 'Développement web',
      taken: 22,
      capacity: 25,
      title: 'React de A à Z (6 séances)',
      summary: 'Six séances pour construire une application React complète.',
      description:
        'Une formation en six séances hebdomadaires, des composants jusqu’au déploiement. Chaque séance alterne explications et exercices, avec un projet fil rouge.',
      date: toIsoDate(reactStart),
      startTime: '17h00',
      endTime: '19h00',
      location: 'Salle B08',
      level: 'Niveau intermédiaire',
      duration: '6 séances de 2 heures',
      bring: 'Ordinateur portable avec Node.js installé',
      outcomes: [
        'Découper une interface en composants',
        'Gérer l’état avec les hooks',
        'Appeler une API REST',
        'Déployer son application',
      ],
      sessions: weekly(reactStart, 6),
    },
    {
      slug: 'hack-night',
      type: 'evenement',
      pole: 'Communauté',
      taken: 60,
      capacity: 60,
      title: 'Hack’Night SC2',
      summary: 'Une nuit entière pour prototyper un projet en équipe.',
      description:
        'Quatorze heures de code, de 18 h à 8 h du matin. Les équipes se forment sur place, un jury de professionnels désigne les trois meilleurs prototypes au lever du jour.',
      date: toIsoDate(addDays(base, 21)),
      startTime: '18h00',
      endTime: '08h00',
      location: 'Hall principal',
      level: 'Tous niveaux',
      duration: 'Une nuit',
      bring: 'Ordinateur portable, chargeur et de quoi tenir la nuit',
      outcomes: [
        'Former une équipe et choisir un sujet',
        'Livrer un prototype en une nuit',
        'Présenter son projet devant un jury',
        'Rencontrer les autres pôles du club',
      ],
    },
    {
      slug: 'conference-carrieres',
      type: 'evenement',
      pole: 'Communauté',
      taken: 62,
      capacity: 150,
      title: 'Conférence : carrières dans la tech',
      summary: 'Trois anciens de l’école racontent leur parcours.',
      description:
        'Trois diplômés, aujourd’hui ingénieurs en cybersécurité, en data et en développement, racontent leurs premières années de carrière et répondent à vos questions.',
      date: toIsoDate(addDays(base, 26)),
      startTime: '18h00',
      endTime: '19h30',
      location: 'Amphi A',
      level: 'Tous niveaux',
      duration: '1 h 30',
      bring: 'Vos questions',
      outcomes: [
        'Découvrir trois métiers de la tech',
        'Comprendre ce que recherchent les recruteurs',
        'Préparer sa recherche de stage',
        'Échanger avec des anciens',
      ],
    },
    {
      slug: 'python-data',
      type: 'formation',
      pole: 'IA & data',
      taken: 26,
      capacity: 30,
      title: 'Python pour la data (5 séances)',
      summary: 'De pandas à un premier modèle d’apprentissage automatique.',
      description:
        'Cinq séances pour manipuler des données avec pandas, les visualiser et entraîner un premier modèle. Aucune connaissance préalable en data n’est requise.',
      date: toIsoDate(pythonStart),
      startTime: '10h00',
      endTime: '12h00',
      location: 'Salle B12',
      level: 'Niveau débutant',
      duration: '5 séances de 2 heures',
      bring: 'Ordinateur portable avec Python installé',
      outcomes: [
        'Nettoyer un jeu de données',
        'Produire des graphiques lisibles',
        'Entraîner un modèle simple',
        'Évaluer ses résultats',
      ],
      sessions: weekly(pythonStart, 5),
    },
  ];
}

const reservationCode = (type, number) =>
  `SC2-${{ workshop: 'WS', formation: 'FO', evenement: 'EV' }[type]}-${String(1000 + number)}`;

export async function seed(client = prisma) {
  const base = referenceSaturday();
  const sharedHash = bcrypt.hashSync('etudiant123', 10);

  await client.$transaction(async (tx) => {
    await tx.registration.deleteMany();
    await tx.payment.deleteMany();
    await tx.contactMessage.deleteMany();
    await tx.news.deleteMany();
    await tx.boardMember.deleteMany();
    await tx.activity.deleteMany();
    await tx.user.deleteMany();

    const generatedUsers = [];
    let number = 0;
    for (const lastName of LAST) {
      for (const firstName of FIRST) {
        number += 1;
        const createdAt = addDays(new Date(), -(10 + (number % 30)));
        generatedUsers.push({
          firstName,
          lastName,
          email: `${firstName}.${lastName}`.toLowerCase() + '@supcom.tn',
          passwordHash: sharedHash,
          role: 'MEMBER',
          membershipStatus: 'ACTIVE',
          level: LEVELS[number % LEVELS.length],
          poles: POLES[number % POLES.length],
          memberNumber: `SC2-${String(number).padStart(4, '0')}`,
          createdAt,
        });
      }
    }
    await tx.user.createMany({ data: generatedUsers });
    const generatedMembers = await tx.user.findMany({
      where: { email: { in: generatedUsers.map((user) => user.email) } },
      select: { id: true },
      orderBy: { id: 'asc' },
    });

    const yasmine = await tx.user.create({
      data: {
        firstName: 'Yasmine',
        lastName: 'Trabelsi',
        email: DEMO.member.email,
        passwordHash: bcrypt.hashSync(DEMO.member.password, 10),
        role: 'MEMBER',
        membershipStatus: 'ACTIVE',
        level: '2e année Télécom',
        poles: 'Développement web, IA & data',
        memberNumber: 'SC2-0457',
        createdAt: addDays(new Date(), -33),
      },
    });
    const youssef = await tx.user.create({
      data: {
        firstName: 'Youssef',
        lastName: 'Ayari',
        email: DEMO.admin.email,
        passwordHash: bcrypt.hashSync(DEMO.admin.password, 10),
        role: 'ADMIN',
        membershipStatus: 'ACTIVE',
        level: '3e année Télécom',
        poles: 'Développement web',
        memberNumber: 'SC2-0102',
        createdAt: addDays(new Date(), -60),
      },
    });

    await tx.user.createMany({
      data: [
        ['Selim', 'Abidi', 3],
        ['Fatma', 'Zouari', 2],
        ['Ahmed', 'Rekik', 1],
      ].map(([firstName, lastName, age], index) => ({
        firstName,
        lastName,
        email: `${firstName}.${lastName}`.toLowerCase() + '@supcom.tn',
        passwordHash: sharedHash,
        role: 'MEMBER',
        membershipStatus: 'PENDING',
        level: index === 1 ? '2e année Informatique' : '1re année Tronc commun',
        poles: POLES[index],
        motivation:
          'Je souhaite progresser en pratiquant avec d’autres étudiants.',
        createdAt: addDays(new Date(), -age),
      })),
    });

    const paymentData = generatedMembers.map((member, index) => ({
      userId: member.id,
      academicYear: ACADEMIC_YEAR,
      amount: MEMBERSHIP_FEE,
      status:
        (index + 1) % 8 === 0
          ? 'UNPAID'
          : (index + 1) % 6 === 0
            ? 'PENDING'
            : 'PAID',
    }));
    paymentData.push(
      {
        userId: yasmine.id,
        academicYear: ACADEMIC_YEAR,
        amount: MEMBERSHIP_FEE,
        status: 'PAID',
      },
      {
        userId: youssef.id,
        academicYear: ACADEMIC_YEAR,
        amount: MEMBERSHIP_FEE,
        status: 'PAID',
      },
    );
    await tx.payment.createMany({ data: paymentData });

    const activities = getActivities(base);
    await tx.activity.createMany({
      data: activities.map(
        ({ taken, outcomes, sessions = [], ...activity }) => ({
          ...activity,
          outcomes: JSON.stringify(outcomes),
          sessions: JSON.stringify(sessions),
        }),
      ),
    });
    const persistedActivities = await tx.activity.findMany({
      select: { id: true, slug: true, type: true },
    });
    const idsBySlug = new Map(
      persistedActivities.map((activity) => [activity.slug, activity]),
    );

    const registrations = [];
    let codeCounter = 0;
    for (const activity of activities) {
      const persisted = idsBySlug.get(activity.slug);
      const hasYasmine = ['git-github', 'react-a-z'].includes(activity.slug);
      const participants = generatedMembers.slice(
        0,
        hasYasmine ? activity.taken - 1 : activity.taken,
      );
      if (hasYasmine) participants.push(yasmine);
      for (const member of participants) {
        codeCounter += 1;
        registrations.push({
          userId: member.id,
          activityId: persisted.id,
          code: reservationCode(persisted.type, codeCounter),
          status: 'CONFIRMED',
        });
      }
    }
    await tx.registration.createMany({ data: registrations });

    await tx.boardMember.createMany({
      data: BOARD.map(([name, position, description], sortOrder) => ({
        name,
        position,
        description,
        email: name.toLowerCase().replaceAll(' ', '.') + '@supcom.tn',
        sortOrder,
      })),
    });
    await tx.news.createMany({
      data: [
        {
          title: 'Deux équipes SC2 sur le podium du hackathon national',
          excerpt: 'Retour sur 36 heures de code, de prototypage et de pitchs.',
          tag: 'Compétition',
          date: toIsoDate(addDays(new Date(), -3)),
        },
        {
          title: 'La formation React de A à Z a démarré',
          excerpt: '22 membres suivent les six séances du mercredi.',
          tag: 'Formation',
          date: toIsoDate(addDays(new Date(), -12)),
        },
        {
          title: 'Le nouveau bureau 2026-2027 est élu',
          excerpt: 'Découvrez l’équipe et les postes pour cette année.',
          tag: 'Vie du club',
          date: toIsoDate(addDays(new Date(), -24)),
        },
      ],
    });
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  seed()
    .then(() => prisma.$disconnect())
    .then(() => console.log('Base remplie avec les données de démonstration.'))
    .catch(async (error) => {
      console.error(error);
      await prisma.$disconnect();
      process.exitCode = 1;
    });
}
