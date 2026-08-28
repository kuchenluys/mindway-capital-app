# 🌐 FASE 7: LANDING PAGE

**Duración:** 5 días | **Prioridad:** 🟡 MEDIA

---

## SETUP

```bash
# Crear Next.js project
npx create-next-app@latest landing-page --tailwind
cd landing-page

# Instalar paquetes
npm install next-seo react-scroll
```

---

## ESTRUCTURA

```
landing-page/
├── src/pages/
│   ├── index.tsx       → Homepage
│   ├── pricing.tsx     → Pricing page
│   ├── blog/
│   │   └── [slug].tsx  → Blog posts
│   └── api/
│       └── newsletter.ts
├── src/components/
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   └── CTA.tsx
└── public/
    ├── images/
    └── logo.svg
```

---

## PÁGINAS CLAVE

### 1. Hero Section
- Logo
- Headline: "Trading Inteligente con IA"
- CTA buttons: "Comenzar Gratis" + "Ver Demo"
- Hero image/video

### 2. Features Showcase
- 4-6 features principales
- Icons + descriptions
- Screenshots

### 3. Pricing Table
```
Free      $0/mes    5 trades
Premium   $29/mes   Unlimited + IA
Elite     $99/mes   VIP + Support
```

### 4. Testimonials
- 3-5 trader testimonials
- Avatar + name + quote

### 5. FAQ Section
- 8-10 preguntas frecuentes

### 6. Blog Posts
- Últimos 3 artículos trading
- Link a blog completo

### 7. Newsletter Signup
- Email input
- Submit button
- Validación

---

## NEXT.JS CONFIG

`next.config.js`:
```javascript
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.example.com'],
  },
  redirects: async () => [
    {
      source: '/app',
      destination: 'https://mindwaycapital.com/dashboard',
      permanent: false,
    }
  ]
}
```

---

## DEPLOYMENT (Vercel)

```bash
git push origin main
# Auto-deploy a Vercel

# URL: https://mindwaycapital.com
```

---

## SEO OPTIMIZATION

```typescript
// pages/index.tsx
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Mindway Capital - Trading Inteligente con IA</title>
        <meta name="description" content="Plataforma de trading avanzada con predicciones IA, análisis técnico y leaderboards" />
        <meta property="og:title" content="Mindway Capital" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://mindwaycapital.com" />
      </Head>
      {/* Content */}
    </>
  );
}
```

---

## FORMS & API

```typescript
// pages/api/newsletter.ts
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    
    // Save to database
    // Send welcome email
    
    res.json({ success: true });
  }
}
```

---

## CHECKLIST

- [ ] Design finalized
- [ ] Pages creadas
- [ ] SEO meta tags
- [ ] Images optimized
- [ ] Forms working
- [ ] Analytics hooked
- [ ] Deployed to production
- [ ] SSL/TLS working
- [ ] Lighthouse > 90

---

**Próximo:** Fase 8 - Monitoring

