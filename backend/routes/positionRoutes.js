import express from 'express';
import { body } from 'express-validator';
import * as positionController from '../controllers/positionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Create position
router.post('/', [
  body('symbol').notEmpty().withMessage('Symbol requerido'),
  body('type').isIn(['long', 'short']).withMessage('Tipo debe ser long o short'),
  body('entryPrice').isFloat({ gt: 0 }).withMessage('Precio de entrada válido requerido'),
  body('stopLoss').isFloat({ gt: 0 }).withMessage('Stop Loss válido requerido'),
  body('takeProfit').isFloat({ gt: 0 }).withMessage('Take Profit válido requerido')
], positionController.createPosition);

// Get all positions
router.get('/', positionController.getPositions);

// Get position stats
router.get('/stats', positionController.getStats);

// Get single position
router.get('/:id', positionController.getPosition);

// Update position
router.put('/:id', positionController.updatePosition);

// Close position
router.post('/:id/close', [
  body('exitPrice').isFloat({ gt: 0 }).withMessage('Exit price válido requerido')
], positionController.closePosition);

// Delete position
router.delete('/:id', positionController.deletePosition);

export default router;
