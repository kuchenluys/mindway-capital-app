import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', (req, res) => {
  res.json({
    activeUsers: 1248,
    publishedContent: 342,
    monthlyRevenue: 24500,
    retentionRate: 87
  });
});

router.get('/users', (req, res) => res.json({ users: [] }));
router.get('/revenue', (req, res) => res.json({ revenue: [] }));
router.get('/engagement', (req, res) => res.json({ engagement: [] }));

export default router;
