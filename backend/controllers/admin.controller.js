import { listActivities } from '../lib/activities.js';
import { prisma } from '../lib/prisma.js';

const ACADEMIC_YEAR = '2026-2027';
const MEMBERSHIP_FEE = 20;

function calculateFillRate(activities) {
  if (activities.length === 0) return 0;

  const totalFillRate = activities.reduce(
    (total, activity) => total + activity.taken / activity.capacity,
    0,
  );
  return Math.round((totalFillRate / activities.length) * 100);
}

export const overview = async (_req, res, next) => {
  try {
    const [students, requests, allActivities] = await Promise.all([
      prisma.user.findMany({
        where: { membershipStatus: 'ACTIVE' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          level: true,
          memberNumber: true,
          createdAt: true,
          payments: {
            where: { academicYear: ACADEMIC_YEAR },
            select: { status: true },
            take: 1,
          },
        },
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      }),
      prisma.user.findMany({
        where: { membershipStatus: 'PENDING' },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          level: true,
          poles: true,
          motivation: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      listActivities(),
    ]);

    const normalizedStudents = students.map(({ payments, ...student }) => ({
      ...student,
      paymentStatus: payments[0]?.status ?? 'UNPAID',
    }));
    const upcoming = allActivities.filter(
      (activity) => activity.status !== 'past',
    );
    const paid = normalizedStudents.filter(
      (student) => student.paymentStatus === 'PAID',
    ).length;
    const fillRate = calculateFillRate(upcoming);

    return res.json({
      stats: {
        members: normalizedStudents.length,
        pendingRequests: requests.length,
        paid,
        pending: normalizedStudents.filter(
          (student) => student.paymentStatus === 'PENDING',
        ).length,
        unpaid: normalizedStudents.filter(
          (student) => student.paymentStatus === 'UNPAID',
        ).length,
        paidRate: normalizedStudents.length
          ? Math.round((paid / normalizedStudents.length) * 100)
          : 0,
        fillRate,
      },
      students: normalizedStudents,
      requests,
      activities: upcoming.map(
        ({ id, slug, title, type, taken, capacity }) => ({
          id,
          slug,
          title,
          type,
          taken,
          capacity,
        }),
      ),
    });
  } catch (error) {
    return next(error);
  }
};

export const decideAdhesion = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const { decision } = req.body;

    // L'adhésion et la création de la première cotisation doivent réussir ensemble.
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findFirst({
        where: { id: userId, membershipStatus: 'PENDING' },
        select: { id: true, firstName: true },
      });
      if (!user) return null;

      if (decision === 'REFUSED') {
        await tx.user.update({
          where: { id: user.id },
          data: { membershipStatus: 'REFUSED' },
        });
      } else {
        await tx.user.update({
          where: { id: user.id },
          data: {
            membershipStatus: 'ACTIVE',
            memberNumber: `SC2-${String(1000 + user.id)}`,
          },
        });
        await tx.payment.upsert({
          where: {
            userId_academicYear: {
              userId: user.id,
              academicYear: ACADEMIC_YEAR,
            },
          },
          create: {
            userId: user.id,
            academicYear: ACADEMIC_YEAR,
            amount: MEMBERSHIP_FEE,
            status: 'PENDING',
          },
          update: {},
        });
      }
      return user;
    });

    if (!result)
      return res
        .status(404)
        .json({ error: 'Demande introuvable ou déjà traitée.' });
    return res.json({
      message:
        decision === 'ACTIVE'
          ? `Adhésion de ${result.firstName} validée.`
          : `Demande de ${result.firstName} refusée.`,
    });
  } catch (error) {
    return next(error);
  }
};

export const setPayment = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const user = await prisma.user.findFirst({
      where: { id: userId, membershipStatus: 'ACTIVE' },
      select: { id: true },
    });
    if (!user) return res.status(404).json({ error: 'Membre introuvable.' });

    await prisma.payment.upsert({
      where: {
        userId_academicYear: { userId: user.id, academicYear: ACADEMIC_YEAR },
      },
      create: {
        userId: user.id,
        academicYear: ACADEMIC_YEAR,
        amount: MEMBERSHIP_FEE,
        status: req.body.status,
      },
      update: { status: req.body.status },
    });
    return res.json({ message: 'Statut de cotisation mis à jour.' });
  } catch (error) {
    return next(error);
  }
};
