import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { publicUser, signToken } from '../middlewares/auth.middleware.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    // Le message reste le même si l'adresse ou le mot de passe est incorrect.
    const passwordIsValid =
      user && bcrypt.compareSync(password, user.passwordHash);

    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ error: 'Adresse e-mail ou mot de passe incorrect.' });
    }
    if (user.membershipStatus === 'PENDING') {
      return res.status(403).json({
        error:
          'Votre demande d’adhésion est en cours de validation par le bureau.',
      });
    }
    if (user.membershipStatus === 'REFUSED') {
      return res.status(403).json({
        error:
          'Votre demande d’adhésion n’a pas été retenue. Contactez le bureau.',
      });
    }

    return res.json({ token: signToken(user), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const adhesion = async (req, res, next) => {
  const { firstName, lastName, email, password, level, poles, motivation } =
    req.body;
  try {
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: bcrypt.hashSync(password, 10),
        level,
        poles: poles.join(', '),
        motivation,
      },
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Certains champs sont à corriger.',
        fields: {
          email: 'Un compte ou une demande existe déjà avec cette adresse.',
        },
      });
    }
    return next(error);
  }

  return res
    .status(201)
    .json({ message: 'Demande envoyée. Le bureau la valide sous 48 heures.' });
};

export const me = (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Session expirée.' });
  return res.json({ user: publicUser(req.user) });
};
