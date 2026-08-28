# 🏗️ Arquitectura Mindway Capital

---

## Visión General

Mindway Capital es una **plataforma de trading full-stack** que integra:
- Frontend moderno (React 18)
- Backend escalable (Node.js + Express)
- Mobile nativo (React Native)
- AI/ML predicciones
- Tiempo real (WebSockets)
- Pagos (Stripe)
- Gamificación
- Internacionalización

---

## Capas Arquitectónicas

### 1. Presentation Layer (Frontend + Mobile)

**Frontend (React 18 + TypeScript)**
- SPA con React Router
- Redux Toolkit para state management
- Componentes reutilizables con Tailwind
- Integración TradingView para charts
- Real-time updates vía WebSocket

**Mobile (React Native + Expo)**
- Compartir 70% código con frontend
- EAS para builds iOS/Android
- Secure storage para auth tokens
- Push notifications
- OTA updates

---

### 2. API Layer (Express + Node.js)

**RESTful Endpoints**
```
GET    /api/trades           → Listar trades
POST   /api/trades           → Crear trade
GET    /api/positions        → Posiciones abiertas
POST   /api/positions/:id    → Cerrar posición
GET    /api/analytics        → Stats personales
GET    /api/leaderboard      → Rankings
```

**WebSocket Events**
```
socket.on('price:update')     → Precio tick
socket.on('position:update')  → P&L actualizado
socket.on('notification')     → Alertas
socket.on('trade:executed')   → Confirmación
```

**Middleware Stack**
```
Request → Auth (JWT) → Validation (Zod) → Business Logic → Response
```

---

### 3. Business Logic Layer

**Services**
- `TradeService` - Ejecución, P&L, liquidación
- `AIService` - Predicciones, señales, backtesting
- `GameService` - Achievements, levels, challenges
- `AnalyticsService` - Métricas, stats, rankings
- `PaymentService` - Stripe, suscripciones

**Models (Sequelize ORM)**
- User
- Trade
- Position
- Subscription
- Achievement
- Leaderboard

---

### 4. Data Layer

**PostgreSQL (AWS RDS)**
- Primary database
- Relationships: Users → Trades → Positions
- Transactions para operaciones críticas
- Backups automáticos

**Redis (AWS ElastiCache)**
- Cache de precios
- Sessions
- Rate limiting
- Job queue

---

## Flujos Clave

### Flujo de Trading

```
User Click "Buy" 
  ↓
Validate (position size, balance)
  ↓
Create Trade record
  ↓
Calculate P&L
  ↓
Emit WebSocket "trade:executed"
  ↓
Update Portfolio value
  ↓
Update leaderboard rankings
```

### Flujo de IA

```
Market data (OHLCV)
  ↓
Feature engineering (RSI, MACD, etc.)
  ↓
ML model inference
  ↓
Generate prediction + confidence
  ↓
Generate trading signal (BUY/SELL/HOLD)
  ↓
Display in UI with strength gauge
```

### Flujo de Pagos

```
User selects "Premium"
  ↓
Redirect to Stripe checkout
  ↓
User pays
  ↓
Stripe webhook POST
  ↓
Create Subscription record
  ↓
Update user.plan = "premium"
  ↓
Unlock features
```

---

## Patrones de Diseño

### 1. Repository Pattern
```typescript
class UserRepository {
  async findById(id: string) { }
  async create(data: UserData) { }
  async update(id: string, data: Partial<UserData>) { }
}
```

### 2. Service Layer Pattern
```typescript
class TradeService {
  constructor(private tradeRepo: TradeRepository) { }
  
  async executeTrade(userId, order) {
    // Validar
    // Guardar
    // Notificar
  }
}
```

### 3. Dependency Injection
```typescript
export const container = {
  tradeService: new TradeService(tradeRepository),
  aiService: new AIService(modelLoader),
};
```

### 4. Observer Pattern (WebSocket)
```typescript
socket.on('price:update', (data) => {
  updateUserP&L(data);
  updateLeaderboard();
  notifyIfAlertTriggered();
});
```

---

## Escalabilidad

### Horizontal Scaling

**Backend**
- Múltiples instancias EC2 detrás de ALB
- Auto-scaling groups basado en CPU/memory
- Stateless: JWT para sesiones, Redis para cache

**Base de datos**
- Read replicas en RDS para queries pesadas
- Connection pooling con Sequelize
- Indexes en columnas frecuentes

**Cache**
- Redis cluster para alta concurrencia
- Cache invalidation inteligente
- Session storage distribuido

---

### Vertical Scaling

**Optimizaciones**
- Lazy loading de datos
- Pagination (20 items por página)
- Database query optimization
- Asset minification + CDN
- Image optimization

---

## Security

### Authentication
- JWT tokens (7 días expiry)
- Refresh tokens (30 días)
- 2FA TOTP opcional
- OAuth2 (Google, GitHub)

### Authorization
- Role-based access control (RBAC)
- Free, Premium, Elite tiers
- Feature gates por plan

### Data Protection
- HTTPS/TLS everywhere
- Passwords hashed con bcrypt
- Secrets en AWS Secrets Manager
- Audit logs para trades

### API Security
- Rate limiting (100 req/min)
- CORS configurado
- Input validation (Zod)
- SQL injection prevention (Sequelize)
- XSS protection (CSP headers)

---

## Monitoreo & Observabilidad

### Error Tracking (Sentry)
- Backend + Frontend errors
- Distributed tracing
- Performance metrics
- Release tracking

### Performance (New Relic)
- APM dashboard
- Slow query detection
- Database monitoring
- Memory leaks

### Logs (CloudWatch)
- Structured logging (JSON)
- Log groups por servicio
- Retention 30 días
- Alerts on error rates

### Analytics (Google Analytics)
- User behavior tracking
- Conversion funnels
- Session duration
- Feature usage

---

## Deployment Pipeline

```
Git Push
  ↓
GitHub Actions CI
  ├─ Lint + Type check
  ├─ Run tests
  ├─ Build artifacts
  └─ Push to container registry
  ↓
Deploy to Production
  ├─ Backend → AWS EC2 (PM2)
  ├─ Frontend → Vercel (auto-deploy)
  ├─ Mobile → EAS (manual builds)
  └─ Database migrations (auto)
  ↓
Smoke tests
  ├─ Health checks
  ├─ Critical flows
  └─ Monitoring setup
  ↓
Production ✅
```

---

## Trade-offs y Decisiones

### ✅ Decidimos: PostgreSQL + Redis
- **Pro:** Relational integrity, caching flexible
- **Con:** No es NoSQL, requiere schema migrations
- **Decisión:** Correctness > flexibility para trading

### ✅ Decidimos: JWT Stateless
- **Pro:** Escalable, no requiere session storage
- **Con:** Logout es más lento (token sigue válido)
- **Decisión:** Usamos token blacklist en Redis

### ✅ Decidimos: React + React Native
- **Pro:** Compartir código, equipo unificado
- **Con:** Performance móvil vs nativo
- **Decisión:** Expo OTA updates mitigan delays

### ✅ Decidimos: Stripe directo
- **Pro:** Payment provider confiable
- **Con:** No manejamos datos de tarjeta
- **Decisión:** PCI-DSS compliance automático

---

## Roadmap Futuro

**Post-Lanzamiento (Meses 1-3)**
- Notificaciones push
- API pública para traders
- Social trading (copy trades)
- Análisis avanzado (heatmaps)

**Mediano plazo (Meses 4-6)**
- Integración con brokers reales
- Automated strategy backtesting
- Marketplace de estrategias
- Community features (grupos, forums)

**Largo plazo (Meses 6-12)**
- Mobile app exclusivas
- Premium analytics
- Algoritmic trading
- Institutional tier

---

## Contacto & Preguntas

- Arquitecta: tech@mindwaycapital.com
- Issues: GitHub Issues
- Diskusiones: Discord #development

