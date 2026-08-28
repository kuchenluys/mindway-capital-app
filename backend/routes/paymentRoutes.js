import express from 'express';
import { body } from 'express-validator';
import * as paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// === CLIENTE STRIPE ===
router.post('/customer', paymentController.createStripeCustomer);

// === SUSCRIPCIONES ===
router.post('/subscribe', [
  body('plan').isIn(['premium', 'elite']).withMessage('Plan inválido'),
  body('paymentMethodId').notEmpty().withMessage('Payment method requerido')
], paymentController.createSubscription);

router.get('/subscription', paymentController.getSubscription);

router.put('/subscription/change-plan', [
  body('newPlan').isIn(['premium', 'elite']).withMessage('Plan inválido')
], paymentController.changePlan);

router.delete('/subscription', paymentController.cancelSubscription);

// === FACTURAS ===
router.get('/invoices', paymentController.getInvoices);

// === MÉTODOS DE PAGO ===
router.get('/payment-methods', paymentController.getPaymentMethods);

router.post('/payment-methods', [
  body('paymentMethodId').notEmpty().withMessage('Payment method ID requerido')
], paymentController.addPaymentMethod);

router.delete('/payment-methods/:paymentMethodId', paymentController.deletePaymentMethod);

export default router;
