// Tests de l'API sur une base SQLite temporaire : `npm test`.
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createApp } from '../server.js';
import { prisma } from '../lib/prisma.js';
import { DEMO, seed } from '../prisma/seed.js';

let server;
let base;

before(async () => {
  await seed();
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}/api`;
});

after(async () => {
  if (server)
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  await prisma.$disconnect();
});

async function call(method, path, { body, token } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, data: await response.json() };
}

async function login({ email, password }) {
  const { data } = await call('POST', '/auth/login', {
    body: { email, password },
  });
  return data.token;
}

test('la liste des activités donne les places restantes', async () => {
  const { status, data } = await call('GET', '/activities');
  assert.equal(status, 200);
  const git = data.find((a) => a.slug === 'git-github');
  assert.equal(git.remaining, 12);
  assert.equal(git.status, 'open');
  assert.equal(data.find((a) => a.slug === 'hack-night').status, 'full');
  assert.equal(data.find((a) => a.slug === 'react-a-z').status, 'started');
});

test('les filtres par type, disponibilité et recherche fonctionnent', async () => {
  const workshops = (await call('GET', '/activities?type=workshop')).data;
  assert.ok(
    workshops.length === 3 && workshops.every((a) => a.type === 'workshop'),
  );
  const open = (await call('GET', '/activities?available=1')).data;
  assert.ok(open.every((a) => a.status === 'open'));
  const search = (await call('GET', '/activities?q=securite')).data;
  assert.deepEqual(
    search.map((a) => a.slug),
    ['initiation-ctf'],
  );
});

test('un mauvais mot de passe est refusé', async () => {
  const { status } = await call('POST', '/auth/login', {
    body: { email: DEMO.member.email, password: 'faux' },
  });
  assert.equal(status, 401);
});

test('un visiteur ne peut pas réserver', async () => {
  const { status } = await call(
    'POST',
    '/activities/initiation-ctf/reservations',
  );
  assert.equal(status, 401);
});

test('un membre réserve une place, une seule fois, puis l’annule', async () => {
  const token = await login(DEMO.member);
  const first = await call('POST', '/activities/initiation-ctf/reservations', {
    token,
  });
  assert.equal(first.status, 201);
  assert.equal(first.data.registration.status, 'CONFIRMED');
  assert.match(first.data.registration.code, /^SC2-WS-\d{4}$/);

  const second = await call('POST', '/activities/initiation-ctf/reservations', {
    token,
  });
  assert.equal(second.status, 409);

  const detail = await call('GET', '/activities/initiation-ctf', { token });
  assert.equal(detail.data.remaining, 8);
  assert.equal(detail.data.myRegistration.code, first.data.registration.code);

  const cancelled = await call(
    'DELETE',
    `/me/reservations/${first.data.registration.id}`,
    { token },
  );
  assert.equal(cancelled.status, 200);
  assert.equal(
    (await call('GET', '/activities/initiation-ctf')).data.remaining,
    9,
  );
});

test('une activité complète place le membre en liste d’attente', async () => {
  const token = await login(DEMO.member);
  const { status, data } = await call(
    'POST',
    '/activities/hack-night/reservations',
    { token },
  );
  assert.equal(status, 201);
  assert.equal(data.registration.status, 'WAITLIST');
  assert.equal((await call('GET', '/activities/hack-night')).data.taken, 60);
});

test('la demande d’adhésion est validée champ par champ', async () => {
  const bad = await call('POST', '/auth/adhesion', {
    body: {
      firstName: 'A',
      lastName: 'Test',
      email: 'a@gmail.com',
      password: 'court',
      level: '',
      poles: [],
    },
  });
  assert.equal(bad.status, 400);
  assert.deepEqual(Object.keys(bad.data.fields).sort(), [
    'email',
    'firstName',
    'level',
    'password',
    'poles',
  ]);
});

test('adhésion : demande, connexion refusée, validation par le bureau, connexion acceptée', async () => {
  const candidate = {
    firstName: 'Salma',
    lastName: 'Gharbi',
    email: 'salma.gharbi@supcom.tn',
    password: 'motdepasse1',
    level: '1re année Tronc commun',
    poles: ['Cybersécurité'],
    motivation: '',
  };
  assert.equal(
    (await call('POST', '/auth/adhesion', { body: candidate })).status,
    201,
  );
  assert.equal(
    (await call('POST', '/auth/adhesion', { body: candidate })).status,
    409,
  );
  assert.equal(
    (await call('POST', '/auth/login', { body: candidate })).status,
    403,
  );

  const memberToken = await login(DEMO.member);
  assert.equal(
    (await call('GET', '/admin/overview', { token: memberToken })).status,
    403,
  );

  const adminToken = await login(DEMO.admin);
  const overview = (await call('GET', '/admin/overview', { token: adminToken }))
    .data;
  const request = overview.requests.find((r) => r.email === candidate.email);
  assert.ok(request);

  const decision = await call('PATCH', `/admin/adhesions/${request.id}`, {
    token: adminToken,
    body: { decision: 'ACTIVE' },
  });
  assert.equal(decision.status, 200);

  const session = await call('POST', '/auth/login', { body: candidate });
  assert.equal(session.status, 200);
  const dashboard = await call('GET', '/me/dashboard', {
    token: session.data.token,
  });
  assert.equal(dashboard.data.payment.status, 'PENDING');
  assert.equal(dashboard.data.user.passwordHash, undefined);
});

test('le trésorier modifie le statut d’une cotisation', async () => {
  const adminToken = await login(DEMO.admin);
  const { students } = (
    await call('GET', '/admin/overview', { token: adminToken })
  ).data;
  const unpaid = students.find((s) => s.paymentStatus === 'UNPAID');
  const { status } = await call('PATCH', `/admin/payments/${unpaid.id}`, {
    token: adminToken,
    body: { status: 'PAID' },
  });
  assert.equal(status, 200);
  const after = (
    await call('GET', '/admin/overview', { token: adminToken })
  ).data.students.find((s) => s.id === unpaid.id);
  assert.equal(after.paymentStatus, 'PAID');
});

test('le formulaire de contact refuse un message trop court', async () => {
  const bad = await call('POST', '/contact', {
    body: {
      name: 'Ali',
      email: 'ali@supcom.tn',
      subject: 'Question',
      message: 'court',
    },
  });
  assert.equal(bad.status, 400);
  const ok = await call('POST', '/contact', {
    body: {
      name: 'Ali',
      email: 'ali@supcom.tn',
      subject: 'Question',
      message: 'Bonjour, une question sur le club.',
    },
  });
  assert.equal(ok.status, 201);
});
