import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  res.json({ message: 'Obtener cursos', courses: [] });
});

// Get single course
router.get('/:id', async (req, res) => {
  res.json({ message: 'Obtener curso', course: {} });
});

// Create course (admin only)
router.post('/', protect, authorize('admin', 'editor'), async (req, res) => {
  res.json({ message: 'Curso creado' });
});

// Enroll in course
router.post('/:id/enroll', protect, async (req, res) => {
  res.json({ message: 'Inscrito en curso' });
});

// Get user enrollments
router.get('/user/enrollments', protect, async (req, res) => {
  res.json({ message: 'Cursos del usuario', enrollments: [] });
});

export default router;
