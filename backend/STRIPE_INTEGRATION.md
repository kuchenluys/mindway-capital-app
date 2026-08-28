# 💳 Integración Stripe - Fase 3

## 📋 Descripción

Integración completa de Stripe para manejar suscripciones, pagos, facturación y webhooks en Mindway Capital.

---

## 🚀 Setup Inicial

### 1. Crear Cuenta en Stripe

1. Ir a https://stripe.com
2. Crear una cuenta
3. Obtener claves:
   - **Stripe Secret Key**: `sk_test_...`
   - **Stripe Publishable Key**: `pk_test_...`
   - **Webhook Secret**: `whsec_...` (después de crear endpoint)

### 2. Agregar Variables de Entorno

Agregar a `.env`:

```env
# STRIPE
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### 3. Instalar Dependencia

```bash
npm install stripe
```

### 4. Actualizar Server

Reemplazar `server.js` con `server-updated.js`:

```bash
mv server.js server-old.js
mv server-updated.js server.js
```

---

## 💰 Planes de Precios

### Configuración

```javascript
const PLAN_PRICES = {
  'premium': 2999,  // $29.99/mes
  'elite': 9999     // $99.99/mes
};
```

### Crear en Stripe Dashboard

1. Ir a **Products** → **Add Product**
2. Crear producto: "Mindway Premium"
3. Agregar precio: $29.99/mes
4. Repetir para Elite ($99.99/mes)

---

## 📊 Modelos de Datos

### Subscription
```javascript
{
  id: UUID,
  userId: UUID (fk),
  stripeCustomerId: String (unique),
  stripeSubscriptionId: String (unique),
  plan: 'free' | 'premium' | 'elite',
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid',
  pricePerMonth: Decimal,
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  canceledAt: Date,
  cancelReason: String,
  trialStart: Date,
  trialEnd: Date,
  paymentMethodId: String,
  autoRenew: Boolean
}
```

### Invoice
```javascript
{
  id: UUID,
  userId: UUID (fk),
  stripeInvoiceId: String (unique),
  subscriptionId: UUID (fk),
  amount: Decimal,
  currency: String,
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible',
  invoiceUrl: String,
  pdfUrl: String,
  paidDate: Date,
  attemptCount: Integer
}
```

### Payment
```javascript
{
  id: UUID,
  userId: UUID (fk),
  stripePaymentIntentId: String (unique),
  amount: Decimal,
  status: 'succeeded' | 'processing' | 'requires_action' | 'canceled',
  type: 'subscription' | 'one_time' | 'upgrade' | 'refund',
  paymentMethod: 'card' | 'bank_transfer' | 'paypal',
  cardBrand: String,
  cardLast4: String,
  receiptUrl: String,
  processedAt: Date
}
```

---

## 🔌 API Endpoints

### Crear Cliente Stripe
```
POST /api/payments/customer
Headers: Authorization: Bearer TOKEN

Response:
{
  "message": "Cliente Stripe creado",
  "customerId": "cus_xxx"
}
```

### Crear Suscripción
```
POST /api/payments/subscribe
Headers: Authorization: Bearer TOKEN
Body: {
  "plan": "premium",
  "paymentMethodId": "pm_xxx"
}

Response:
{
  "message": "Suscripción creada exitosamente",
  "subscription": { ... },
  "clientSecret": "pi_xxx_secret_xxx"
}
```

### Obtener Suscripción Actual
```
GET /api/payments/subscription
Headers: Authorization: Bearer TOKEN

Response:
{
  "id": "uuid",
  "plan": "premium",
  "status": "active",
  "currentPeriodEnd": "2026-09-24T..."
}
```

### Cambiar Plan
```
PUT /api/payments/subscription/change-plan
Headers: Authorization: Bearer TOKEN
Body: {
  "newPlan": "elite"
}

Response:
{
  "message": "Plan actualizado exitosamente",
  "subscription": { ... }
}
```

### Cancelar Suscripción
```
DELETE /api/payments/subscription
Headers: Authorization: Bearer TOKEN
Body: {
  "reason": "Razón de cancelación (opcional)"
}

Response:
{
  "message": "Suscripción cancelada",
  "subscription": { ... }
}
```

### Obtener Facturas
```
GET /api/payments/invoices
Headers: Authorization: Bearer TOKEN

Response:
[
  {
    "id": "uuid",
    "amount": 29.99,
    "status": "paid",
    "paidDate": "2026-08-24T...",
    "pdfUrl": "https://..."
  }
]
```

### Obtener Métodos de Pago
```
GET /api/payments/payment-methods
Headers: Authorization: Bearer TOKEN

Response:
{
  "paymentMethods": [
    {
      "id": "pm_xxx",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2026
    }
  ]
}
```

### Agregar Método de Pago
```
POST /api/payments/payment-methods
Headers: Authorization: Bearer TOKEN
Body: {
  "paymentMethodId": "pm_xxx"
}

Response:
{
  "message": "Método de pago agregado",
  "paymentMethodId": "pm_xxx"
}
```

### Eliminar Método de Pago
```
DELETE /api/payments/payment-methods/pm_xxx
Headers: Authorization: Bearer TOKEN

Response:
{
  "message": "Método de pago eliminado"
}
```

---

## 🔔 Webhooks

### Configurar en Stripe Dashboard

1. Ir a **Developers** → **Webhooks**
2. Agregar endpoint:
   - URL: `https://tu-dominio.com/webhooks/stripe`
   - Eventos a escuchar:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.created`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `charge.succeeded`
     - `charge.failed`

### Eventos Manejados

#### Subscription Events
- `customer.subscription.created` - Suscripción creada
- `customer.subscription.updated` - Suscripción actualizada
- `customer.subscription.deleted` - Suscripción cancelada

#### Invoice Events
- `invoice.created` - Factura generada
- `invoice.payment_succeeded` - Pago de factura exitoso
- `invoice.payment_failed` - Pago de factura falló

#### Charge Events
- `charge.succeeded` - Cargo exitoso
- `charge.failed` - Cargo falló

### Testing de Webhooks (Local)

Usar Stripe CLI:

```bash
# Instalar Stripe CLI
# https://stripe.com/docs/stripe-cli

# Triggear evento de prueba
stripe trigger charge.succeeded

# Ver eventos en tiempo real
stripe listen --forward-to localhost:5000/webhooks/stripe
```

---

## 🔐 Seguridad

### Verificación de Webhook
```javascript
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
```

### Mejores Prácticas
- ✅ Usar Webhook Secret para verificar eventos
- ✅ Nunca confiar en datos del cliente para cambios de plan
- ✅ Siempre sincronizar estado con Stripe
- ✅ Manejar reintentos de pagos fallidos
- ✅ Loguear todos los eventos de pago

---

## 📊 Flujo de Suscripción

```
1. Usuario elige plan (Premium/Elite)
   ↓
2. Crear Stripe Customer (si no existe)
   ↓
3. Crear Stripe Setup Intent
   ↓
4. Cliente captura payment method
   ↓
5. Backend crea Stripe Subscription
   ↓
6. Webhook actualiza BD cuando se activa
   ↓
7. Actualizar plan del usuario en BD
   ↓
8. Acceso a funciones premium
```

---

## 💳 Flujo de Pago Único

```
1. Usuario elige acción (Upgrade, Comprar recurso)
   ↓
2. Backend crea Payment Intent
   ↓
3. Frontend muestra Stripe Elements
   ↓
4. Cliente ingresa datos de tarjeta
   ↓
5. Frontend confirma pago
   ↓
6. Webhook confirma pago
   ↓
7. BD actualizada
   ↓
8. Acceso otorgado
```

---

## 🧪 Testing

### Test Cards (Modo Test)

```
Éxito:
- Card: 4242 4242 4242 4242
- CVC: Cualquiera (3 dígitos)
- Fecha: Futuro cualquiera

Fallo:
- Card: 4000 0000 0000 0002

Requiere 3D Secure:
- Card: 4000 0025 0000 3155
```

### Webhooks de Test

```bash
# Crear evento de prueba
stripe trigger customer.subscription.created

# Simular pago exitoso
stripe trigger invoice.payment_succeeded

# Simular pago fallido
stripe trigger invoice.payment_failed
```

---

## 📱 Frontend Integration

### Setup Payment Element (Frontend)

```javascript
// 1. Obtener cliente secret
const response = await fetch('/api/payments/subscribe', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    plan: 'premium',
    paymentMethodId: paymentMethod.id
  })
});

const { clientSecret } = await response.json();

// 2. Confirmar pago en Stripe.js
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret);

if (!error) {
  console.log('Suscripción creada exitosamente!');
}
```

---

## 🔄 Manejo de Errores

### Errores Comunes

```javascript
// Tarjeta rechazada
if (error.code === 'card_declined') {
  // Mostrar: "Tu tarjeta fue rechazada"
}

// Fondos insuficientes
if (error.code === 'insufficient_funds') {
  // Mostrar: "Fondos insuficientes"
}

// Expirada
if (error.code === 'expired_card') {
  // Mostrar: "Tu tarjeta expiró"
}

// Invalid CVC
if (error.code === 'invalid_cvc') {
  // Mostrar: "CVC inválido"
}
```

---

## 📧 Notificaciones

### Por Implementar

- [ ] Email cuando suscripción se activa
- [ ] Email recordatorio 7 días antes de renovación
- [ ] Email cuando pago falla
- [ ] Email de factura (automático en Stripe)
- [ ] Email de cancelación confirmada

---

## 📈 Analytics & Reporting

### Métricas Clave

```javascript
// MRR (Monthly Recurring Revenue)
const getMRR = async () => {
  const subscriptions = await Subscription.findAll({
    where: { status: 'active' }
  });
  return subscriptions.reduce((sum, sub) => sum + sub.pricePerMonth, 0);
};

// Churn Rate
const getChurnRate = async () => {
  const canceled = await Subscription.count({
    where: { status: 'canceled' },
    where: { canceledAt: { [Op.gte]: new Date(Date.now() - 30*24*60*60*1000) } }
  });
  // ...
};

// Upgrades
const getUpgrades = async () => {
  // Contar cambios de plan free → premium/elite
};
```

---

## 🚀 Deployment

### Variables de Entorno (Producción)

```env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_your_live_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_secret
FRONTEND_URL=https://mindwaycapital.com
```

### Setup de Webhook (Producción)

1. Cambiar a claves LIVE en Stripe
2. Crear nuevo webhook endpoint con URL de producción
3. Obtener nuevo webhook secret
4. Actualizar .env en producción

---

## 📞 Soporte Stripe

- **Documentación**: https://stripe.com/docs
- **API Reference**: https://stripe.com/docs/api
- **Status Page**: https://status.stripe.com
- **Community**: https://stackoverflow.com/questions/tagged/stripe

---

## ✅ Checklist de Implementación

- [x] Crear modelos (Subscription, Invoice, Payment)
- [x] Crear controladores
- [x] Crear rutas
- [x] Implementar webhooks
- [x] Documentar endpoints
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Frontend integration
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Deployment a producción

---

**Fase 3: Pagos con Stripe - COMPLETADA ✅**

Próximo: Fase 4 - React + TypeScript Migration
