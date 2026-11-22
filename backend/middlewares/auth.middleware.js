import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const secret = () => process.env.JWT_SECRET || 'secret-de-developpement';

export function signToken(user) {
  return jwt.sign({ sub: user.id }, secret(), { expiresIn: '7d' });
}

export function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function loadUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  let payload;
  try {
    payload = jwt.verify(token, secret());
  } catch {
    req.user = null;
    return next();
  }

  prisma.user
    .findUnique({ where: { id: Number(payload.sub) } })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
}

export function requireMember(req, res, next) {
  if (!req.user)
    return res.status(401).json({ error: 'Connectez-vous pour continuer.' });
  if (req.user.membershipStatus !== 'ACTIVE') {
    return res
      .status(403)
      .json({ error: 'Votre adhésion n’est pas encore validée.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user)
    return res.status(401).json({ error: 'Connectez-vous pour continuer.' });
  if (req.user.role !== 'ADMIN')
    return res.status(403).json({ error: 'Accès réservé au bureau.' });
  next();
}
