# 💳 FASE 5: STRIPE LIVE SETUP

**Duración:** 1 día  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ⏳ A COMENZAR

---

## 📋 PASO 1: STRIPE ACCOUNT VERIFICATION

### Ir a https://dashboard.stripe.com

1. **Completar Business Profile:**
   - Nombre legal
   - Dirección
   - Tipo de negocio
   - Descripción

2. **Verificar identidad:**
   - Nombre completo
   - Fecha de nacimiento
   - Número de identificación
   - Foto del documento

3. **Información bancaria:**
   - Cuenta bancaria
   - Número de ruta
   - Tipo de cuenta

4. **Esperar verificación:** ~24-48 horas

---

## PASO 2: OBTENER LIVE API KEYS

### En Stripe Dashboard:

```
Settings → API Keys
```

**Copiar:**

```
Publishable Key (pk_live_...):
pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop

Secret Key (sk_live_...):
sk_live_4eC39HqLyjWDarhtT657L81100222XXXXXXXXXXXXXXXX

Webhook Signing Secret:
whsec_test_secret_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

⚠️ **GUARDAR EN LUGAR SEGURO - NUNCA COMPARTIR**

---

## PASO 3: CONFIGURAR EN APLICACIÓN

### Backend (.env.production)

```env
STRIPE_SECRET_KEY=sk_live_4eC39HqLyjWDarhtT657L81100222XXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_test_secret_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
STRIPE_PUBLISH_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop
```

### Frontend (.env.production)

```env
VITE_STRIPE_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop
```

### Actualizar código backend

`backend/src/config/stripe.ts`:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2024-04-10',
  }
);

export default stripe;
```

---

## PASO 4: CREAR PRODUCTOS Y PRECIOS

### En Stripe Dashboard:

```
Products → Add Product
```

**Crear 3 productos:**

### 1. Plan Free
```
Name: Free Plan
Description: Acceso básico a Mindway Capital
Price: $0 / month
Type: Recurring
```

### 2. Plan Premium
```
Name: Premium Plan
Description: Acceso completo a análisis IA y trading
Price: $29.99 / month
Type: Recurring
Billing Period: Monthly
```

### 3. Plan Elite
```
Name: Elite Plan
Description: Acceso VIP con soporte prioritario
Price: $99.99 / month
Type: Recurring
Billing Period: Monthly
```

### Copiar Price IDs:

```
Free: price_free (o libre)
Premium: price_1234567890
Elite: price_1234567891
```

---

## PASO 5: ACTUALIZAR BACKEND CON PRICING

`backend/src/config/stripe.ts`:

```typescript
export const STRIPE_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceId: null,
    price: 0,
    features: [
      'Hasta 5 operaciones/mes',
      'Dashboard básico',
      'Comunidad de traders'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceId: 'price_1234567890',
    price: 2999, // en centavos
    features: [
      'Operaciones ilimitadas',
      'Análisis IA completo',
      'Backtesting',
      'Leaderboards',
      'Soporte por email'
    ]
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    priceId: 'price_1234567891',
    price: 9999, // en centavos
    features: [
      'Todo de Premium',
      'Soporte VIP 24/7',
      'Trading automático',
      'Alertas personalizadas',
      'Análisis diarios'
    ]
  }
};
```

---

## PASO 6: WEBHOOKS CONFIGURATION

### En Stripe Dashboard:

```
Developers → Webhooks → Add endpoint
```

**Configurar:**

```
Endpoint URL: https://api.mindwaycapital.com/webhooks/stripe
Description: Mindway Capital Stripe Webhooks
API Version: Latest (2024-04-10)
```

**Eventos a escuchar:**

```
✅ charge.failed
✅ charge.succeeded
✅ customer.created
✅ customer.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
✅ payment_intent.succeeded
✅ payment_intent.payment_failed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
```

**Copiar Signing Secret:**

```
whsec_test_secret_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

---

## PASO 7: WEBHOOK HANDLER BACKEND

`backend/src/routes/webhooks.ts`:

```typescript
import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import stripe from '@config/stripe';

const router = express.Router();

// Raw body parser para Stripe
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Handle eventos
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log('Payment succeeded:', paymentIntent.id);
          // TODO: Update user subscription
          break;

        case 'payment_intent.payment_failed':
          const failedPayment = event.data.object as Stripe.PaymentIntent;
          console.log('Payment failed:', failedPayment.id);
          // TODO: Notify user
          break;

        case 'customer.subscription.created':
          const subscription = event.data.object as Stripe.Subscription;
          console.log('Subscription created:', subscription.id);
          // TODO: Update user plan
          break;

        case 'customer.subscription.deleted':
          const deletedSub = event.data.object as Stripe.Subscription;
          console.log('Subscription deleted:', deletedSub.id);
          // TODO: Downgrade to free plan
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      const error = err as Error;
      console.error('Webhook error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
```

---

## PASO 8: PAYMENT INTENT CREATION

`backend/src/controllers/payments.ts`:

```typescript
import stripe from '@config/stripe';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, planId, email } = req.body;

    // Create or get customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        userId: req.user.id
      }
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // en centavos
      currency: 'usd',
      customer: customer.id,
      metadata: {
        planId,
        userId: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { priceId, customerId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });

    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
```

---

## PASO 9: FRONTEND PAYMENT INTEGRATION

`frontend/src/services/stripe.ts`:

```typescript
import { loadStripe } from '@stripe/js';
import axios from '@/config/api';

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_KEY
);

export const createPaymentIntent = async (
  amount: number,
  planId: string
) => {
  const response = await axios.post('/payments/intent', {
    amount,
    planId
  });

  return response.data;
};

export const processPayment = async (
  elements,
  clientSecret: string
) => {
  const stripe = await stripePromise;

  const result = await stripe!.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/dashboard?payment=success`
    }
  });

  return result;
};

export const createSubscription = async (planId: string) => {
  const response = await axios.post('/subscriptions/create', {
    priceId: STRIPE_PLANS[planId].priceId
  });

  return response.data;
};
```

---

## PASO 10: TESTING PAYMENTS

### Usar tarjetas de prueba:

```
Successful payment:
4242 4242 4242 4242
CVC: 123
Exp: 12/25

Declined payment:
4000 0000 0000 0002
CVC: 123
Exp: 12/25

3D Secure required:
4000 0025 0000 3155
CVC: 123
Exp: 12/25
```

### Test en dashboard:

```bash
# En development
npm run dev

# Ir a: http://localhost:5173/planes
# Elegir plan
# Usar tarjeta de test
# Verificar en Stripe Dashboard que aparece en events
```

---

## PASO 11: LIVE TESTING

Una vez en producción:

### Usar Stripe CLI para webhooks:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Listen to webhooks (sin ir a producción todavía)
stripe listen --forward-to api.mindwaycapital.com/webhooks/stripe

# En otra terminal, trigger test event
stripe trigger payment_intent.succeeded
```

### Monitorar en dashboard:

```
Developers → Events
```

Ver que aparecen los eventos en tiempo real.

---

## ✅ VERIFICATION CHECKLIST

```bash
# 1. API Keys configuradas
echo $STRIPE_SECRET_KEY
# Debería mostrar: sk_live_...

# 2. Webhook endpoint respondiendo
curl -X POST https://api.mindwaycapital.com/webhooks/stripe \
  -H "stripe-signature: test"
# Debería retornar: 400 (invalid signature, esperado)

# 3. Payment intent creándose
curl -X POST https://api.mindwaycapital.com/payments/intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2999, "planId": "premium"}'
# Debería retornar: clientSecret

# 4. Test payment con tarjeta de prueba
# En frontend, intentar pagar con 4242 4242 4242 4242
# Debería completarse sin error

# 5. Webhook recibido
# Verificar en Stripe Dashboard → Events
# Debería ver: payment_intent.succeeded
```

---

## 📊 MONITORING

```
Stripe Dashboard → Logs
```

Track:
- Pagos completados
- Pagos fallidos
- Suscripciones activas
- Disputas (chargebacks)
- Refunds

---

## 💰 PRICING STRATEGY

**Recomendado:**

```
Free: $0
  - 5 trades/month
  - Basic analytics
  - Community access

Premium: $29.99/month
  - Unlimited trades
  - AI predictions
  - Advanced analytics
  - Leaderboards

Elite: $99.99/month
  - Everything in Premium
  - 24/7 support
  - Automated trading
  - Daily analysis
```

---

## 🔄 REFUND & DISPUTE HANDLING

```typescript
// Procesar refund
export const refundPayment = async (paymentId: string) => {
  const refund = await stripe.refunds.create({
    payment_intent: paymentId
  });
  return refund;
};

// Responder dispute
export const respondToDispute = async (chargeId: string) => {
  const dispute = await stripe.disputes.list({
    charge: chargeId
  });
  
  // Agregar evidencia si es necesario
  if (dispute.data.length > 0) {
    await stripe.disputes.submitEvidence(dispute.data[0].id, {
      evidence: {
        receipt: 'required_evidence_file_id'
      }
    });
  }
};
```

---

## ✅ FINAL CHECKLIST

- [ ] Stripe account verificada
- [ ] Live API keys obtenidas
- [ ] Keys en environment variables
- [ ] Productos creados en Stripe
- [ ] Precios configurados
- [ ] Webhook endpoint configured
- [ ] Webhook eventos escuchándose
- [ ] Backend handlers implementados
- [ ] Frontend Stripe.js integrado
- [ ] Test payments funcionan
- [ ] Suscripciones se crean correctamente
- [ ] Webhooks recibidos correctamente
- [ ] Receipts se envían
- [ ] Dashboard monitoring activo

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 6 - Mobile Build

**Tiempo para esta fase:** 1 día  
**Una vez completado:** ✅ Pagos en vivo funcionando
