import { Router } from 'express';
import { z } from 'zod';
import { send } from '../controllers/contact.controller.js';
import { validate } from '../middlewares/validate.middleware.js';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom.'),
  email: z.string().trim().email('Adresse e-mail invalide.'),
  subject: z.string().trim().min(3, 'Indiquez un sujet.'),
  message: z
    .string()
    .trim()
    .min(10, 'Votre message est trop court (10 caractères au moins).'),
});

const router = Router();
router.post('/contact', validate(contactSchema), send);

export default router;
