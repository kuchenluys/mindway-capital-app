import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Nombre es requerido'),
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres'),
  body('passwordConfirm').notEmpty().withMessage('Confirmación de contraseña requerida')
], authController.register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Email válido requerido'),
  body('password').notEmpty().withMessage('Contraseña requerida')
], authController.login);

// Get current user
router.get('/me', protect, authController.getMe);

// Update profile
router.put('/profile', protect, authController.updateProfile);

// Change password
router.post('/change-password', protect, [
  body('currentPassword').notEmpty().withMessage('Contraseña actual requerida'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nueva contraseña mínimo 6 caracteres'),
  body('passwordConfirm').notEmpty().withMessage('Confirmación requerida')
], authController.changePassword);

export default router;
