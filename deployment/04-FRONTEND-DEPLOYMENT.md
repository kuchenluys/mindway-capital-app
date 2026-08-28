# 🎨 FASE 4: FRONTEND DEPLOYMENT (Vercel)

**Duración:** 1-2 días  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ⏳ A COMENZAR

---

## 📋 OPCIÓN RECOMENDADA: VERCEL

Vercel es la mejor opción para React porque:
- Optimización automática Next.js/Vite
- Deploy desde Git en 1 clic
- CDN global
- Preview deployments para cada PR
- Environment variables seguras
- Serverless functions
- Analytics integrado

---

## PASO 1: PREPARAR FRONTEND

```bash
cd frontend

# Verificar que compila
npm run build

# Debería crear: dist/
ls -la dist/

# Instalar Vercel CLI
npm install -g vercel

# Login en Vercel
vercel login
# Sigue pasos en el browser
```

---

## PASO 2: CREAR PROYECTO EN VERCEL

### Opción A: Desde GitHub (Recomendado)

```bash
# 1. Ir a https://vercel.com/new
# 2. Seleccionar "Import Git Repository"
# 3. Conectar GitHub account
# 4. Seleccionar repo: mindway-capital
# 5. Seleccionar carpeta raíz: ./frontend
# 6. Configurar:

Project Name: mindway-capital-frontend
Framework Preset: Vite
Root Directory: ./frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

### Opción B: Desde CLI

```bash
# En la carpeta frontend/
vercel

# Responder preguntas:
# ? Set up and deploy "~/mindway-capital/frontend"? [Y/n] Y
# ? Which scope do you want to deploy to? mindway-capital
# ? Link to existing project? [y/N] N
# ? What's your project's name? mindway-capital-frontend
# ? In which directory is your code? ./
# ? Want to modify vercel.json to define build steps? [Y/n] N

# Deploy!
```

---

## PASO 3: CREAR vercel.json

Crear `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "vite",
  "regions": ["iad1"],
  "env": {
    "VITE_API_URL": "@vite_api_url",
    "VITE_WEBSOCKET_URL": "@vite_websocket_url",
    "VITE_STRIPE_KEY": "@vite_stripe_key"
  },
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/index.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/app",
      "destination": "/dashboard"
    }
  ]
}
```

---

## PASO 4: ENVIRONMENT VARIABLES

### En Vercel Dashboard:

```
Project Settings → Environment Variables
```

Agregar:

```env
# Production
VITE_API_URL=https://api.mindwaycapital.com
VITE_WEBSOCKET_URL=wss://api.mindwaycapital.com
VITE_STRIPE_KEY=pk_live_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnop
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Configurar para:
- ✅ Production
- ✅ Preview
- ✅ Development

---

## PASO 5: CUSTOM DOMAIN SETUP

### En Vercel Dashboard:

```
Settings → Domains
```

1. **Agregar dominio:**
   ```
   Domain: mindwaycapital.com
   ```

2. **Configur DNS (en tu registrador):**

   **Opción A: Nameservers (Recomendado)**
   - Vercel te proporciona 4 nameservers
   - En tu registrador (GoDaddy, Namecheap, etc.):
     - Cambiar nameservers a los de Vercel
     - Esperar 24-48 horas

   **Opción B: CNAME Record**
   - Crear CNAME: `mindwaycapital.com → cname.vercel-dns.com`
   - Crear A record para `www`

3. **Verificar:**
   ```bash
   # Esperar a que DNS se propague
   nslookup mindwaycapital.com
   
   # Debería mostrar IP de Vercel
   ```

4. **SSL/TLS Automático:**
   - Vercel proporciona certificado Let's Encrypt
   - Automático y renovado cada 90 días
   - ✅ HTTPS habilitado

---

## PASO 6: CUSTOM SUBDOMAIN

Para `app.mindwaycapital.com`:

```
Settings → Domains → Add
```

```
Domain: app.mindwaycapital.com
```

Mismo proceso DNS pero para subdomain.

---

## PASO 7: GIT AUTO-DEPLOY

En Vercel Dashboard:

```
Settings → Git → Deployments
```

Configurar:

```
Production Branch: main
Preview Branches: All except production
Auto-Deploy: On
```

Ahora cada `git push` deploya automáticamente.

---

## PASO 8: BUILD OPTIMIZATION

Crear `.vercelignore`:

```
node_modules
.git
.env
.env*.local
.next
out
.nuxt
dist
build
.cache
.vuepress/dist
.serverless
.fusebox
.dynamodb
.tern-port
.venv
venv
ENV
env
.DS_Store
```

---

## PASO 9: PERFORMANCE OPTIMIZATION

### Instalar paquetes:

```bash
npm install -D @vercel/analytics next-seo

# (Aunque sea Vite, agregar analytics)
```

### En `frontend/src/main.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Image Optimization:

```bash
npm install next-image-export-optimizer
```

---

## PASO 10: PREVIEW DEPLOYMENTS

Cada PR automáticamente:
1. Crea preview URL única
2. Ejecuta tests
3. Genera Lighthouse report
4. Comenta en PR

---

## ✅ VERIFICATION CHECKLIST

```bash
# 1. Build local
cd frontend
npm run build
# Verificar: ✅ sin errores

# 2. Build en Vercel
# Ver: https://vercel.com/mindway-capital/mindway-capital-frontend/deployments
# Debería estar: ✅ "Ready"

# 3. Test domain
curl https://mindwaycapital.com
# Debería retornar: ✅ HTML del sitio

# 4. HTTPS check
https://mindwaycapital.com
# Debería mostrar: ✅ Candado verde

# 5. Analytics
https://vercel.com/mindway-capital/mindway-capital-frontend/analytics
# Debería mostrar: ✅ Métricas

# 6. Lighthouse
https://vercel.com/mindway-capital/mindway-capital-frontend
# Click "Inspect" en deployment
# Debería mostrar: ✅ Score > 90
```

---

## 🚀 DEPLOY COMMANDS

```bash
# Preview deployment
vercel

# Production deployment (main branch)
git push origin main
# Automático en Vercel

# Manual production
vercel --prod
```

---

## 📊 EXPECTED RESULTS

```
Performance:
✅ First Contentful Paint: < 1.5s
✅ Largest Contentful Paint: < 2.5s
✅ Cumulative Layout Shift: < 0.1

SEO:
✅ Lighthouse score: > 90
✅ Mobile friendly
✅ Meta tags present

Security:
✅ HTTPS enabled
✅ Security headers set
✅ CSP configured
```

---

## 🔧 TROUBLESHOOTING

### Build fails

```bash
# Check build locally first
npm run build

# View error in Vercel logs
vercel logs
```

### Slow performance

```bash
# Check bundle size
npm run build
ls -lh dist/

# Optimize:
# - Remove unused dependencies
# - Code splitting enabled
# - Image optimization
```

### CORS errors

```
In API configuration (backend):
CORS_ORIGIN=https://mindwaycapital.com,https://app.mindwaycapital.com

In frontend, environment:
VITE_API_URL=https://api.mindwaycapital.com
```

---

## 📈 MONITORING

```
Vercel Dashboard → Analytics
```

Track:
- Page views
- Response times
- Error rates
- Device breakdown
- Geographic data

---

## 🔄 REDEPLOY STRATEGIES

**Preview (staging):**
```bash
git push origin feature/something
# Automático preview deploy
# URL: https://mindway-capital-frontend-{branch}.vercel.app
```

**Production:**
```bash
git push origin main
# Automático production deploy
# URL: https://mindwaycapital.com
```

**Rollback:**
```
Vercel Dashboard → Deployments
Click previous deployment → "Promote to Production"
```

---

## ✅ FINAL CHECKLIST

- [ ] Frontend compila sin errores
- [ ] Vercel proyecto creado
- [ ] Environment variables configuradas
- [ ] Custom domain apuntando
- [ ] HTTPS funcionando
- [ ] Auto-deploy desde main
- [ ] Preview deployments working
- [ ] Performance score > 90
- [ ] Analytics funcionando
- [ ] Error handling working

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 5 - Stripe Live Setup

**Tiempo para esta fase:** 1-2 días  
**Una vez completado:** ✅ Frontend en producción
