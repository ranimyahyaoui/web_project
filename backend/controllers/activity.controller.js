import { findActivity, listActivities } from '../lib/activities.js';
import { prisma } from '../lib/prisma.js';

const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const stats = async (_req, res, next) => {
  try {
    const [members, activities] = await Promise.all([
      prisma.user.count({ where: { membershipStatus: 'ACTIVE' } }),
      prisma.activity.count(),
    ]);
    return res.json({ members, activities, poles: 4 });
  } catch (error) {
    return next(error);
  }
};

export const home = async (_req, res, next) => {
  try {
    const [members, activitiesCount, activities, news] = await Promise.all([
      prisma.user.count({ where: { membershipStatus: 'ACTIVE' } }),
      prisma.activity.count(),
      listActivities(),
      prisma.news.findMany({ orderBy: { date: 'desc' } }),
    ]);
    return res.json({
      activities: activities.filter((activity) => activity.status !== 'past'),
      stats: { members, activities: activitiesCount, poles: 4 },
      news,
    });
  } catch (error) {
    return next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { type, pole, q, available } = req.query;
    let activities = (await listActivities()).filter(
      (activity) => activity.status !== 'past',
    );

    if (type)
      activities = activities.filter((activity) => activity.type === type);
    if (pole)
      activities = activities.filter((activity) => activity.pole === pole);
    if (available === '1')
      activities = activities.filter((activity) => activity.status === 'open');
    if (q) {
      const needle = normalize(String(q));
      activities = activities.filter((activity) =>
        normalize(
          `${activity.title} ${activity.summary} ${activity.pole} ${activity.location}`,
        ).includes(needle),
      );
    }

    return res.json(activities);
  } catch (error) {
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const activity = await findActivity(req.params.slug);
    if (!activity)
      return res.status(404).json({ error: 'Activité introuvable.' });

    const myRegistration = req.user
      ? await prisma.registration.findUnique({
          where: {
            userId_activityId: { userId: req.user.id, activityId: activity.id },
          },
          select: { id: true, code: true, status: true },
        })
      : null;
    return res.json({ ...activity, myRegistration });
  } catch (error) {
    return next(error);
  }
};

export const board = async (_req, res, next) => {
  try {
    const members = await prisma.boardMember.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        description: true,
        email: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
    return res.json(members);
  } catch (error) {
    return next(error);
  }
};

export const news = async (_req, res, next) => {
  try {
    return res.json(await prisma.news.findMany({ orderBy: { date: 'desc' } }));
  } catch (error) {
    return next(error);
  }
};
