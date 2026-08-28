import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', (req, res) => res.json({ files: [] }));
router.post('/upload', protect, authorize('admin', 'editor'), (req, res) => res.json({ message: 'Archivo subido' }));
router.delete('/:id', protect, authorize('admin'), (req, res) => res.json({ message: 'Archivo eliminado' }));

export default router;
