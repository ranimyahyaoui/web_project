import { Router } from 'express';
import * as memberController from '../controllers/member.controller.js';
import { requireMember } from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
  '/activities/:slug/reservations',
  requireMember,
  memberController.reserve,
);
router.delete(
  '/me/reservations/:id',
  requireMember,
  memberController.cancelReservation,
);
router.get('/me/dashboard', requireMember, memberController.dashboard);

export default router;
