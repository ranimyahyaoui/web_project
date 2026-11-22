import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Adresse e-mail invalide.'),
  password: z.string().min(1, 'Saisissez votre mot de passe.'),
});

const adhesionSchema = z.object({
  firstName: z.string().trim().min(2, 'Indiquez votre prénom.'),
  lastName: z.string().trim().min(2, 'Indiquez votre nom.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Adresse e-mail invalide.')
    .refine(
      (email) => email.endsWith('@supcom.tn'),
      'Utilisez votre adresse universitaire (@supcom.tn).',
    ),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  level: z.string().trim().min(2, 'Choisissez votre niveau.'),
  poles: z.array(z.string()).min(1, 'Choisissez au moins un pôle.'),
  motivation: z.string().trim().max(500, '500 caractères au plus.').default(''),
});

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/adhesion', validate(adhesionSchema), authController.adhesion);
router.get('/me', authController.me);

export default router;
