import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// === CREAR SETUP INTENT ===
export const createSetupIntent = async (customerId) => {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card']
    });
    return setupIntent;
  } catch (error) {
    throw new Error(`Error creando setup intent: ${error.message}`);
  }
};

// === CREAR PAYMENT INTENT ===
export const createPaymentIntent = async (customerId, amount, currency = 'usd') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: Math.round(amount * 100), // Convertir a centavos
      currency,
      automatic_payment_methods: { enabled: true }
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Error creando payment intent: ${error.message}`);
  }
};

// === OBTENER CLIENTE ===
export const getCustomer = async (customerId) => {
  try {
    return await stripe.customers.retrieve(customerId);
  } catch (error) {
    throw new Error(`Error obteniendo cliente: ${error.message}`);
  }
};

// === OBTENER SUSCRIPCIÓN ===
export const getSubscription = async (subscriptionId) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    throw new Error(`Error obteniendo suscripción: ${error.message}`);
  }
};

// === LISTAR SUSCRIPCIONES DEL CLIENTE ===
export const listSubscriptions = async (customerId) => {
  try {
    return await stripe.subscriptions.list({
      customer: customerId,
      limit: 10
    });
  } catch (error) {
    throw new Error(`Error listando suscripciones: ${error.message}`);
  }
};

// === REFUNDAR PAGO ===
export const refundCharge = async (chargeId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount: amount ? Math.round(amount * 100) : undefined
    });
    return refund;
  } catch (error) {
    throw new Error(`Error reembolsando: ${error.message}`);
  }
};

// === ENVIAR INVOICE ===
export const sendInvoice = async (invoiceId) => {
  try {
    return await stripe.invoices.sendInvoice(invoiceId);
  } catch (error) {
    throw new Error(`Error enviando factura: ${error.message}`);
  }
};

// === OBTENER PORTAL SESSION ===
export const getPortalSession = async (customerId, returnUrl) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });
    return session;
  } catch (error) {
    throw new Error(`Error creando sesión de portal: ${error.message}`);
  }
};

export default stripe;
