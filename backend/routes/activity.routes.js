import { Router } from 'express';
import * as activityController from '../controllers/activity.controller.js';

const router = Router();

router.get('/health', (_req, res) => res.json({ ok: true }));
router.get('/home', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=30');
  return activityController.home(req, res, next);
});
router.get('/stats', (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=30');
  return activityController.stats(_req, res, next);
});
router.get('/activities', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=30');
  return activityController.list(req, res, next);
});
router.get('/activities/:slug', activityController.detail);
router.get('/board', (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=30');
  return activityController.board(_req, res, next);
});
router.get('/news', (_req, res, next) => {
  res.set('Cache-Control', 'public, max-age=30');
  return activityController.news(_req, res, next);
});

export default router;
