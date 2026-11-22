import { Router } from 'express';
import * as activityController from '../controllers/activity.controller.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.get('/stats', activityController.stats);
router.get('/activities', activityController.list);
router.get('/activities/:slug', activityController.detail);
router.get('/board', activityController.board);
router.get('/news', activityController.news);

export default router;
