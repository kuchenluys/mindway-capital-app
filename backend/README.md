# 🔧 Mindway Capital - Backend API

Backend Node.js + Express para la plataforma Mindway Capital. API REST completa con autenticación JWT, base de datos PostgreSQL y soporte para transacciones de Stripe.

## 📋 Requisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **PostgreSQL** >= 12
- **Redis** (opcional, para cache)

## 🚀 Instalación

### 1. Clonar y configurar

```bash
cd backend
npm install
cp .env.example .env
```

### 2. Configurar variables de entorno

Edita `.env` con tus valores:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindway_capital
DB_USER=postgres
DB_PASSWORD=tu_contraseña

JWT_SECRET=tu-clave-secreta-muy-larga
FRONTEND_URL=http://localhost:3000
```

### 3. Crear base de datos

```bash
createdb mindway_capital
```

### 4. Ejecutar migraciones

```bash
npm run migrate
npm run seed
```

### 5. Iniciar servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:5000`

---

## 📚 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración Sequelize
├── controllers/
│   ├── authController.js    # Lógica de autenticación
│   ├── positionController.js # Lógica de posiciones
│   └── ...
├── models/
│   ├── User.js              # Modelo Usuario
│   ├── Position.js          # Modelo Posición
│   ├── Course.js            # Modelo Curso
│   └── ...
├── routes/
│   ├── authRoutes.js        # Rutas de auth
│   ├── positionRoutes.js    # Rutas de posiciones
│   └── ...
├── middleware/
│   ├── auth.js              # JWT middleware
│   └── errorHandler.js      # Error handling
├── utils/
│   └── logger.js            # Logging
├── server.js                # Punto de entrada
├── package.json
└── .env.example
```

---

## 🔐 Autenticación

### Registro

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Luis Kuchen",
  "email": "luis@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Respuesta:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": { "id": "...", "name": "Luis Kuchen", "email": "luis@example.com" },
  "token": "eyJhbGc..."
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "luis@example.com",
  "password": "password123"
}
```

### Usar Token

En todos los requests autenticados, incluir header:

```
Authorization: Bearer eyJhbGc...
```

---

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual
- `PUT /api/auth/profile` - Actualizar perfil
- `POST /api/auth/change-password` - Cambiar contraseña

### Posiciones (Trading)
- `GET /api/positions` - Listar posiciones
- `POST /api/positions` - Crear posición
- `GET /api/positions/:id` - Obtener posición
- `PUT /api/positions/:id` - Actualizar posición
- `POST /api/positions/:id/close` - Cerrar posición
- `DELETE /api/positions/:id` - Eliminar posición
- `GET /api/positions/stats` - Estadísticas de trading

### Cursos
- `GET /api/courses` - Listar cursos
- `GET /api/courses/:id` - Obtener curso
- `POST /api/courses` - Crear curso (admin)
- `POST /api/courses/:id/enroll` - Inscribirse

### Artículos
- `GET /api/articles` - Listar artículos
- `GET /api/articles/:id` - Obtener artículo
- `POST /api/articles` - Crear artículo (admin)
- `PUT /api/articles/:id` - Actualizar artículo
- `DELETE /api/articles/:id` - Eliminar artículo

### Analytics (Admin)
- `GET /api/analytics/dashboard` - Dashboard principal
- `GET /api/analytics/users` - Métricas de usuarios
- `GET /api/analytics/revenue` - Ingresos
- `GET /api/analytics/engagement` - Engagement

### Health Check
- `GET /api/health` - Estado del servidor

---

## 💾 Modelos de Base de Datos

### User
```javascript
{
  id: UUID,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin' | 'editor' | 'moderator',
  plan: 'free' | 'premium' | 'elite',
  planExpiry: Date,
  lastLogin: Date,
  isActive: Boolean,
  preferences: JSON,
  createdAt: Date,
  updatedAt: Date
}
```

### Position
```javascript
{
  id: UUID,
  userId: UUID (FK),
  symbol: String,
  type: 'long' | 'short',
  entryPrice: Decimal,
  stopLoss: Decimal,
  takeProfit: Decimal,
  exitPrice: Decimal,
  status: 'open' | 'closed' | 'pending',
  profitLoss: Decimal,
  profitLossPercent: Decimal,
  pips: Integer,
  notes: Text,
  openedAt: Date,
  closedAt: Date
}
```

### Course
```javascript
{
  id: UUID,
  title: String,
  description: Text,
  category: String,
  instructor: String,
  duration: Integer,
  modules: Integer,
  level: 'beginner' | 'intermediate' | 'advanced',
  price: Decimal,
  isPublished: Boolean,
  rating: Decimal,
  enrollments: Integer
}
```

### Article
```javascript
{
  id: UUID,
  title: String,
  slug: String (unique),
  content: Text,
  authorId: UUID (FK),
  section: String,
  isPublished: Boolean,
  views: Integer,
  likes: Integer,
  tags: Array,
  publishedAt: Date
}
```

---

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --coverage
```

---

## 📊 Migraciones

```bash
# Crear migración
npm run migrate:create -- --name nombre_migracion

# Ejecutar migraciones
npm run migrate

# Revertir última
npm run migrate:undo
```

---

## 🔄 Scripts Disponibles

```json
{
  "start": "node server.js",
  "dev": "nodemon server.js",
  "test": "jest --coverage",
  "migrate": "node scripts/migrate.js",
  "seed": "node scripts/seed.js"
}
```

---

## 🛡️ Seguridad

### Implementado
- ✅ Hashing de contraseñas (bcryptjs)
- ✅ JWT para autenticación
- ✅ CORS habilitado
- ✅ Helmet para headers HTTP
- ✅ Validación con express-validator
- ✅ Rate limiting (próximo)

### Por Implementar
- ⏳ 2FA (Autenticación de dos factores)
- ⏳ OAuth (Google, GitHub)
- ⏳ Passkeys
- ⏳ IP Whitelist (admin)

---

## 🚀 Deployment

### Heroku

```bash
heroku create mindway-api
heroku config:set NODE_ENV=production
heroku addons:create heroku-postgresql
git push heroku main
```

### Docker

```bash
docker build -t mindway-api .
docker run -p 5000:5000 mindway-api
```

---

## 🔧 Solucionar Problemas

### Error de conexión a BD

```bash
# Verificar PostgreSQL está corriendo
psql postgres

# Crear base de datos si no existe
createdb mindway_capital
```

### Error de puerto en uso

```bash
# Cambiar puerto en .env
PORT=5001
```

### Token expirado

Usa `/api/auth/refresh` para obtener nuevo token (por implementar)

---

## 📞 Soporte

Para problemas o preguntas, contacta a:
- Email: luis@mindwaycapital.com
- GitHub Issues: [Tu repositorio]

---

## 📄 Licencia

MIT © 2026 Mindway Capital

---

**Estado**: Fase 2 - Backend en desarrollo (MVP completo)  
**Última actualización**: 24 de Agosto 2026
