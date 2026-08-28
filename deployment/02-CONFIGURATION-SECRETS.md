# 🔒 FASE 2: CONFIGURATION & SECRETS

**Duración:** 1-2 días  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ⏳ A COMENZAR

---

## 📋 PASO 1: GENERAR SECRETOS SEGUROS

**Generar JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: 8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
```

**Generar API Keys:**
```bash
# Usar https://www.uuidgenerator.net/ para generar UUIDs largos
# o usar node:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔧 PASO 2: BACKEND CONFIGURATION

### Crear `.env.production` en backend:

```env
# ========== ENVIRONMENT ==========
NODE_ENV=production
PORT=3000
API_URL=https://api.mindwaycapital.com

# ========== DATABASE ==========
DB_HOST=mindway-prod.c4kzpqj3c4jk.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=mindway_capital
DB_USER=postgres
DB_PASSWORD=SUPER_STRONG_PASSWORD_HERE
DATABASE_URL=postgresql://postgres:SUPER_STRONG_PASSWORD_HERE@mindway-prod.c4kzpqj3c4jk.us-east-1.rds.amazonaws.com:5432/mindway_capital

# ========== REDIS ==========
REDIS_URL=redis://default:redis-password@mindway-redis.c4kzpqj3c4jk.ng.0001.use1.cache.amazonaws.com:6379

# ========== JWT & SECURITY ==========
JWT_SECRET=8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# ========== STRIPE ==========
STRIPE_SECRET_KEY=sk_live_4eC39HqLyjWDarhtT657L81100222XXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_test_secret_123456789XXXXXXXXXXXXXXXXXXXXXXXX
STRIPE_PUBLISH_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop

# ========== EMAIL ==========
SENDGRID_API_KEY=SG.1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghij
SENDGRID_FROM_EMAIL=noreply@mindwaycapital.com
SENDGRID_FROM_NAME=Mindway Capital

# ========== AWS ==========
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=mindway-capital-prod
AWS_CLOUDFRONT_DOMAIN=d123456.cloudfront.net

# ========== EXTERNAL SERVICES ==========
TRADINGVIEW_API_KEY=your_tradingview_api_key
MAIL_FROM=support@mindwaycapital.com
CORS_ORIGIN=https://mindwaycapital.com,https://www.mindwaycapital.com,https://app.mindwaycapital.com

# ========== LOGGING ==========
LOG_LEVEL=info
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

### Crear `backend/config/database.ts`:

```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }
);

export default sequelize;
```

---

## 🎨 PASO 3: FRONTEND CONFIGURATION

### Crear `.env.production` en frontend:

```env
VITE_API_URL=https://api.mindwaycapital.com
VITE_WEBSOCKET_URL=wss://api.mindwaycapital.com
VITE_STRIPE_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop
VITE_TRADINGVIEW_APIKEY=YOUR_TRADINGVIEW_KEY
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_HOTJAR_ID=1234567
```

### Crear `frontend/src/config/api.ts`:

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 📱 PASO 4: MOBILE CONFIGURATION

### Crear `.env.production` en mobile:

```env
API_URL=https://api.mindwaycapital.com
WEBSOCKET_URL=wss://api.mindwaycapital.com
STRIPE_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop
EXPO_PROJECT_ID=12345678-1234-1234-1234-123456789012
EAS_PROJECT_ID=12345678-1234-1234-1234-123456789012
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
```

### Actualizar `mobile/app.json`:

```json
{
  "expo": {
    "name": "Mindway Capital",
    "slug": "mindway-capital",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "extra": {
      "apiUrl": "https://api.mindwaycapital.com",
      "websocketUrl": "wss://api.mindwaycapital.com",
      "eas": {
        "projectId": "12345678-1234-1234-1234-123456789012"
      }
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.mindwaycapital.ios",
      "buildNumber": "1.0.0"
    },
    "android": {
      "package": "com.mindwaycapital",
      "versionCode": 1,
      "permissions": [
        "android.permission.INTERNET",
        "android.permission.CAMERA",
        "android.permission.CAMERA_ROLL"
      ]
    }
  }
}
```

---

## 🔐 PASO 5: SECURITY BEST PRACTICES

### 1. Nunca commitear secrets:

```bash
# Crear .gitignore entries
echo ".env*" >> backend/.gitignore
echo ".env*" >> frontend/.gitignore
echo ".env*" >> mobile/.gitignore

# Verificar que no hay secrets en git
git log --all --oneline --source --grep="password\|secret\|key" --format="%h %s"
```

### 2. Usar variables de entorno en CI/CD:

**GitHub Actions (.github/workflows/deploy.yml):**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY }}
        run: |
          cd backend
          npm install
          npm run build
          npm run deploy
```

### 3. Encrypt sensitive data:

```bash
# Usar AWS Secrets Manager
aws secretsmanager create-secret \
  --name mindway/production/db-password \
  --secret-string "your-strong-password"

# Usar en código:
import { SecretsManager } from 'aws-sdk';
const client = new SecretsManager({ region: 'us-east-1' });
const secret = await client.getSecretValue({ SecretId: 'mindway/production/db-password' });
```

---

## ✅ SECURITY CHECKLIST

- [ ] No .env files committed
- [ ] All secrets in env vars
- [ ] SSL/TLS certificate installed
- [ ] CORS configured correctly
- [ ] HTTPS enforced
- [ ] Database password strong (20+ chars)
- [ ] JWT secret strong (32+ bytes)
- [ ] AWS keys rotated
- [ ] Stripe webhooks secured
- [ ] Email credentials encrypted

---

## 🧪 TESTING CONFIGURATION

### Verificar que todo está correcto:

```bash
# Backend
cd backend
cp .env.example .env.production
npm run test:production

# Frontend
cd frontend
cp .env.example .env.production
npm run build  # Debe compilar sin errores

# Mobile
cd mobile
cp .env.example .env.production
eas build --platform=ios --profile=preview
```

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 3 - Backend Deployment (AWS/Railway)
