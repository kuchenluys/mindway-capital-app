import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), (req, res) => res.json({ users: [] }));
router.get('/:id', protect, (req, res) => res.json({ user: {} }));
router.put('/:id', protect, (req, res) => res.json({ message: 'Usuario actualizado' }));
router.delete('/:id', protect, authorize('admin'), (req, res) => res.json({ message: 'Usuario eliminado' }));

export default router;
