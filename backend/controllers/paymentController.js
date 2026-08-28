import Stripe from 'stripe';
import Subscription from '../models/Subscription.js';
import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Precios de planes en Stripe (en centavos)
const PLAN_PRICES = {
  'premium': 2999, // $29.99/mes
  'elite': 9999    // $99.99/mes
};

// === CREAR CLIENTE STRIPE ===
export const createStripeCustomer = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.stripeCustomerId) {
      return res.json({
        message: 'Cliente Stripe ya existe',
        customerId: user.stripeCustomerId
      });
    }

    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id }
    });

    user.stripeCustomerId = customer.id;
    await user.save();

    res.status(201).json({
      message: 'Cliente Stripe creado',
      customerId: customer.id
    });
  } catch (error) {
    logger.error('Error creando cliente Stripe:', error);
    res.status(500).json({ message: error.message });
  }
};

// === CREAR SUSCRIPCIÓN ===
export const createSubscription = async (req, res) => {
  try {
    const { plan, paymentMethodId } = req.body;

    if (!['premium', 'elite'].includes(plan)) {
      return res.status(400).json({ message: 'Plan inválido' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear cliente si no existe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId }
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
    }

    // Crear suscripción
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price_data: {
        currency: 'usd',
        product_data: { name: `Mindway ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` },
        unit_amount: PLAN_PRICES[plan],
        recurring: { interval: 'month' }
      }}],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    // Guardar en BD
    const sub = await Subscription.create({
      userId: req.userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      plan,
      status: 'active',
      pricePerMonth: PLAN_PRICES[plan] / 100,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      paymentMethodId
    });

    // Actualizar plan del usuario
    user.plan = plan;
    user.planExpiry = new Date(subscription.current_period_end * 1000);
    await user.save();

    res.status(201).json({
      message: 'Suscripción creada exitosamente',
      subscription: sub,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    });
  } catch (error) {
    logger.error('Error creando suscripción:', error);
    res.status(500).json({ message: error.message });
  }
};

// === OBTENER SUSCRIPCIÓN ===
export const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.userId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Sin suscripción activa' });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === CAMBIAR PLAN ===
export const changePlan = async (req, res) => {
  try {
    const { newPlan } = req.body;

    if (!['premium', 'elite'].includes(newPlan)) {
      return res.status(400).json({ message: 'Plan inválido' });
    }

    const subscription = await Subscription.findOne({
      where: { userId: req.userId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Sin suscripción activa' });
    }

    // Actualizar en Stripe
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

    const updated = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price_data: {
            currency: 'usd',
            product_data: { name: `Mindway ${newPlan.charAt(0).toUpperCase() + newPlan.slice(1)} Plan` },
            unit_amount: PLAN_PRICES[newPlan],
            recurring: { interval: 'month' }
          }
        }],
        proration_behavior: 'create_prorations'
      }
    );

    // Actualizar en BD
    subscription.plan = newPlan;
    subscription.pricePerMonth = PLAN_PRICES[newPlan] / 100;
    subscription.currentPeriodEnd = new Date(updated.current_period_end * 1000);
    await subscription.save();

    // Actualizar usuario
    const user = await User.findByPk(req.userId);
    user.plan = newPlan;
    user.planExpiry = new Date(updated.current_period_end * 1000);
    await user.save();

    res.json({
      message: 'Plan actualizado exitosamente',
      subscription
    });
  } catch (error) {
    logger.error('Error cambiando plan:', error);
    res.status(500).json({ message: error.message });
  }
};

// === CANCELAR SUSCRIPCIÓN ===
export const cancelSubscription = async (req, res) => {
  try {
    const { reason } = req.body;

    const subscription = await Subscription.findOne({
      where: { userId: req.userId }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Sin suscripción activa' });
    }

    // Cancelar en Stripe
    await stripe.subscriptions.del(subscription.stripeSubscriptionId);

    // Actualizar en BD
    subscription.status = 'canceled';
    subscription.canceledAt = new Date();
    subscription.cancelReason = reason || 'Usuario canceló';
    await subscription.save();

    // Revertir plan del usuario
    const user = await User.findByPk(req.userId);
    user.plan = 'free';
    user.planExpiry = null;
    await user.save();

    res.json({
      message: 'Suscripción cancelada',
      subscription
    });
  } catch (error) {
    logger.error('Error cancelando suscripción:', error);
    res.status(500).json({ message: error.message });
  }
};

// === OBTENER FACTURAS ===
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { userId: req.userId },
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === OBTENER MÉTODOS DE PAGO ===
export const getPaymentMethods = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user || !user.stripeCustomerId) {
      return res.json({ paymentMethods: [] });
    }

    const methods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card'
    });

    res.json({
      paymentMethods: methods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === AGREGAR MÉTODO DE PAGO ===
export const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Agregar método de pago
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId
    });

    // Establecer como método por defecto
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId }
    });

    res.json({
      message: 'Método de pago agregado',
      paymentMethodId
    });
  } catch (error) {
    logger.error('Error agregando método de pago:', error);
    res.status(500).json({ message: error.message });
  }
};

// === ELIMINAR MÉTODO DE PAGO ===
export const deletePaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    await stripe.paymentMethods.detach(paymentMethodId);

    res.json({ message: 'Método de pago eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
