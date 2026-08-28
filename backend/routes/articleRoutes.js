import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => res.json({ articles: [] }));
router.get('/:id', (req, res) => res.json({ article: {} }));
router.post('/', protect, authorize('admin', 'editor'), (req, res) => res.json({ message: 'Artículo creado' }));
router.put('/:id', protect, authorize('admin', 'editor'), (req, res) => res.json({ message: 'Artículo actualizado' }));
router.delete('/:id', protect, authorize('admin', 'editor'), (req, res) => res.json({ message: 'Artículo eliminado' }));

export default router;
