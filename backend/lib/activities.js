function parseJsonList(value) {
  return JSON.parse(value);
}

function activityStatus(activity, sessions, remaining) {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const lastSession = sessions.length
    ? sessions[sessions.length - 1]
    : activity.date;

  if (lastSession < todayIso) return 'past';
  if (activity.date < todayIso) return 'started';
  return remaining === 0 ? 'full' : 'open';
}

export function toActivity(activity) {
  const sessions = parseJsonList(activity.sessions);
  const taken = activity._count.registrations;
  const remaining = Math.max(activity.capacity - taken, 0);

  const { _count, ...details } = activity;
  return {
    ...details,
    outcomes: parseJsonList(activity.outcomes),
    sessions,
    taken,
    remaining,
    status: activityStatus(activity, sessions, remaining),
  };
}

export async function listActivities() {
  const activities = await prisma.activity.findMany({
    include: {
      _count: {
        select: { registrations: { where: { status: 'CONFIRMED' } } },
      },
    },
    orderBy: { date: 'asc' },
  });
  return activities.map(toActivity);
}

export async function findActivity(slug) {
  const activity = await prisma.activity.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { registrations: { where: { status: 'CONFIRMED' } } },
      },
    },
  });
  return activity ? toActivity(activity) : null;
}
