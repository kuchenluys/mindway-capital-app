import express from 'express';
import * as webhookController from '../controllers/webhookController.js';

const router = express.Router();

// Webhook de Stripe (sin autenticación JWT)
// Debe recibir el body sin procesar (raw)
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.handleWebhook);

export default router;
