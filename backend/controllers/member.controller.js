import { randomInt } from 'node:crypto';
import { findActivity, toActivity } from '../lib/activities.js';
import { prisma } from '../lib/prisma.js';
import { publicUser } from '../middlewares/auth.middleware.js';

const PREFIX = { workshop: 'WS', formation: 'FO', evenement: 'EV' };
const ACADEMIC_YEAR = '2026-2027';

async function newCode(tx, type) {
  for (;;) {
    const code = `SC2-${PREFIX[type]}-${randomInt(1000, 10000)}`;
    const exists = await tx.registration.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!exists) return code;
  }
}

export const reserve = async (req, res, next) => {
  try {
    const activity = await findActivity(req.params.slug);
    if (!activity)
      return res.status(404).json({ error: 'Activité introuvable.' });
    if (activity.status === 'past' || activity.status === 'started') {
      return res
        .status(409)
        .json({ error: 'Les inscriptions à cette activité sont closes.' });
    }

    // Le calcul des places et la réservation sont faits dans la même transaction.
    const registration = await prisma.$transaction(async (tx) => {
      const taken = await tx.registration.count({
        where: { activityId: activity.id, status: 'CONFIRMED' },
      });
      const status = taken < activity.capacity ? 'CONFIRMED' : 'WAITLIST';
      return tx.registration.create({
        data: {
          userId: req.user.id,
          activityId: activity.id,
          code: await newCode(tx, activity.type),
          status,
        },
        select: { id: true, code: true, status: true },
      });
    });

    return res.status(201).json({
      registration,
      message:
        registration.status === 'CONFIRMED'
          ? `Place confirmée. Votre code : ${registration.code}`
          : 'Activité complète : vous êtes sur la liste d’attente.',
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res
        .status(409)
        .json({ error: 'Vous avez déjà une place pour cette activité.' });
    }
    return next(error);
  }
};

export const cancelReservation = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const registration = await prisma.registration.findFirst({
      where: { id, userId: req.user.id },
    });
    if (!registration)
      return res.status(404).json({ error: 'Réservation introuvable.' });

    // La place libérée revient à la première personne de la liste d'attente.
    await prisma.$transaction(async (tx) => {
      await tx.registration.delete({ where: { id: registration.id } });
      if (registration.status !== 'CONFIRMED') return;

      const next = await tx.registration.findFirst({
        where: { activityId: registration.activityId, status: 'WAITLIST' },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      });
      if (next) {
        await tx.registration.update({
          where: { id: next.id },
          data: { status: 'CONFIRMED' },
        });
      }
    });

    return res.json({ message: 'Réservation annulée.' });
  } catch (error) {
    return next(error);
  }
};

export const dashboard = async (req, res, next) => {
  try {
    const [payment, rows] = await Promise.all([
      prisma.payment.findUnique({
        where: {
          userId_academicYear: {
            userId: req.user.id,
            academicYear: ACADEMIC_YEAR,
          },
        },
        select: { academicYear: true, amount: true, status: true },
      }),
      prisma.registration.findMany({
        where: { userId: req.user.id },
        include: {
          activity: {
            include: {
              _count: {
                select: { registrations: { where: { status: 'CONFIRMED' } } },
              },
            },
          },
        },
        orderBy: { activity: { date: 'asc' } },
      }),
    ]);

    const reservations = rows.map((row) => ({
      id: row.id,
      code: row.code,
      status: row.status,
      activity: toActivity(row.activity),
    }));
    return res.json({ user: publicUser(req.user), payment, reservations });
  } catch (error) {
    return next(error);
  }
};
