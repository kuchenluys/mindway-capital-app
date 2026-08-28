import Stripe from 'stripe';
import Subscription from '../models/Subscription.js';
import Invoice from '../models/Invoice.js';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// === MANEJAR WEBHOOKS DE STRIPE ===
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      // === SUSCRIPCIÓN ===
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      // === INVOICE ===
      case 'invoice.created':
        await handleInvoiceCreated(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // === PAYMENT ===
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data.object);
        break;

      default:
        logger.info(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: error.message });
  }
};

// === HANDLERS DE SUSCRIPCIÓN ===
const handleSubscriptionCreated = async (stripeSubscription) => {
  logger.info('Subscription created:', stripeSubscription.id);

  const subscription = await Subscription.findOne({
    where: { stripeSubscriptionId: stripeSubscription.id }
  });

  if (subscription) {
    subscription.status = 'active';
    subscription.currentPeriodStart = new Date(stripeSubscription.current_period_start * 1000);
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);
    await subscription.save();
  }
};

const handleSubscriptionUpdated = async (stripeSubscription) => {
  logger.info('Subscription updated:', stripeSubscription.id);

  const subscription = await Subscription.findOne({
    where: { stripeSubscriptionId: stripeSubscription.id }
  });

  if (subscription) {
    subscription.status = stripeSubscription.status;
    subscription.currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000);

    if (stripeSubscription.canceled_at) {
      subscription.canceledAt = new Date(stripeSubscription.canceled_at * 1000);
    }

    await subscription.save();

    // Actualizar usuario
    const user = await User.findByPk(subscription.userId);
    if (user) {
      if (stripeSubscription.status === 'active') {
        user.planExpiry = new Date(stripeSubscription.current_period_end * 1000);
      } else if (stripeSubscription.status === 'canceled') {
        user.plan = 'free';
        user.planExpiry = null;
      }
      await user.save();
    }
  }
};

const handleSubscriptionDeleted = async (stripeSubscription) => {
  logger.info('Subscription deleted:', stripeSubscription.id);

  const subscription = await Subscription.findOne({
    where: { stripeSubscriptionId: stripeSubscription.id }
  });

  if (subscription) {
    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    await subscription.save();

    // Revertir plan del usuario
    const user = await User.findByPk(subscription.userId);
    if (user) {
      user.plan = 'free';
      user.planExpiry = null;
      await user.save();
    }
  }
};

// === HANDLERS DE INVOICE ===
const handleInvoiceCreated = async (stripeInvoice) => {
  logger.info('Invoice created:', stripeInvoice.id);

  const subscription = await Subscription.findOne({
    where: { stripeSubscriptionId: stripeInvoice.subscription }
  });

  if (subscription) {
    await Invoice.create({
      userId: subscription.userId,
      stripeInvoiceId: stripeInvoice.id,
      stripeCustomerId: stripeInvoice.customer,
      subscriptionId: subscription.id,
      amount: stripeInvoice.amount_paid / 100,
      currency: stripeInvoice.currency.toUpperCase(),
      status: stripeInvoice.status,
      invoiceUrl: stripeInvoice.hosted_invoice_url,
      pdfUrl: stripeInvoice.invoice_pdf,
      dueDate: stripeInvoice.due_date ? new Date(stripeInvoice.due_date * 1000) : null
    });
  }
};

const handleInvoicePaymentSucceeded = async (stripeInvoice) => {
  logger.info('Invoice payment succeeded:', stripeInvoice.id);

  const invoice = await Invoice.findOne({
    where: { stripeInvoiceId: stripeInvoice.id }
  });

  if (invoice) {
    invoice.status = 'paid';
    invoice.paidDate = new Date();
    await invoice.save();
  }
};

const handleInvoicePaymentFailed = async (stripeInvoice) => {
  logger.error('Invoice payment failed:', stripeInvoice.id);

  const invoice = await Invoice.findOne({
    where: { stripeInvoiceId: stripeInvoice.id }
  });

  if (invoice) {
    invoice.status = 'open';
    invoice.attemptCount += 1;
    invoice.lastAttemptDate = new Date();
    invoice.nextRetryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 días
    await invoice.save();

    // Notificar usuario
    const user = await User.findByPk(invoice.userId);
    if (user) {
      logger.warn(`Payment failed for user ${user.email}`);
      // TODO: Enviar email de notificación
    }
  }
};

// === HANDLERS DE CHARGE ===
const handleChargeSucceeded = async (charge) => {
  logger.info('Charge succeeded:', charge.id);

  if (charge.payment_intent) {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: charge.payment_intent }
    });

    if (payment) {
      payment.status = 'succeeded';
      payment.receiptUrl = charge.receipt_url;
      payment.processedAt = new Date();
      payment.cardBrand = charge.payment_method_details?.card?.brand;
      payment.cardLast4 = charge.payment_method_details?.card?.last4;
      await payment.save();
    }
  }
};

const handleChargeFailed = async (charge) => {
  logger.error('Charge failed:', charge.id);

  if (charge.payment_intent) {
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: charge.payment_intent }
    });

    if (payment) {
      payment.status = 'requires_payment_method';
      payment.failureReason = charge.failure_message;
      payment.attemptCount += 1;
      payment.nextRetryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 día
      await payment.save();
    }
  }
};
