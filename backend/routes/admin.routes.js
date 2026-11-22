import { Router } from 'express';
import { z } from 'zod';
import * as adminController from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
const decisionSchema = z.object({ decision: z.enum(['ACTIVE', 'REFUSED']) });
const paymentSchema = z.object({
  status: z.enum(['PAID', 'PENDING', 'UNPAID']),
});

router.use(requireAdmin);
router.get('/overview', adminController.overview);
router.patch(
  '/adhesions/:id',
  validate(decisionSchema),
  adminController.decideAdhesion,
);
router.patch(
  '/payments/:userId',
  validate(paymentSchema),
  adminController.setPayment,
);

export default router;
