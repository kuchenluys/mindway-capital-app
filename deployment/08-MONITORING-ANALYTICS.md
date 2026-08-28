# 📊 FASE 8: MONITORING & ANALYTICS

**Duración:** 2 días | **Prioridad:** 🟡 MEDIA

---

## ERROR TRACKING - SENTRY

### Setup

```bash
npm install @sentry/node @sentry/react

# Backend
# backend/src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: 'production'
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());

# Frontend
# frontend/src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new Sentry.Replay()],
  tracesSampleRate: 0.1
});
```

---

## PERFORMANCE MONITORING - NEW RELIC

```bash
npm install newrelic

# backend/newrelic.js
require('newrelic');
// Must be first require

// .env
NEW_RELIC_LICENSE_KEY=your_key
NEW_RELIC_APP_NAME=mindway-api
```

---

## LOG AGGREGATION - CLOUDWATCH

```typescript
// backend/src/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Send to CloudWatch
if (process.env.NODE_ENV === 'production') {
  logger.add(new WinstonCloudWatch({
    logGroupName: '/mindway/api',
    logStreamName: 'api-stream',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: 'us-east-1'
  }));
}
```

---

## REAL-TIME ANALYTICS - GOOGLE ANALYTICS

```html
<!-- frontend/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: window.location.pathname
  });
</script>
```

---

## HEATMAPS & SESSION REPLAY - HOTJAR

```html
<!-- frontend/index.html -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:1234567,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## DATABASE MONITORING

```bash
# Enable slow query logging
# PostgreSQL
ALTER SYSTEM SET log_min_duration_statement = 1000;
SELECT pg_reload_conf();

# Setup dashboards in CloudWatch
aws cloudwatch put-metric-alarm \
  --alarm-name db-slow-queries \
  --alarm-description "Alert on slow DB queries" \
  --metric-name AuroraBinlogReplicaLag \
  --statistic Average \
  --period 300 \
  --threshold 1000 \
  --comparison-operator GreaterThanThreshold
```

---

## UPTIME MONITORING

```bash
# UptimeRobot (free tier)
# https://uptimerobot.com

# Add monitors:
- https://mindwaycapital.com (5 min check)
- https://api.mindwaycapital.com/health (5 min check)
- https://app.mindwaycapital.com/dashboard (30 min check)

# Alerts → Email when down
```

---

## DASHBOARDS

### CloudWatch Dashboard

```typescript
// AWS CDK / Terraform
{
  "widgets": [
    {
      "type": "metric",
      "properties": {
        "metrics": [
          [ "AWS/EC2", "CPUUtilization" ],
          [ "AWS/RDS", "DatabaseConnections" ],
          [ "AWS/RDS", "ReadLatency" ]
        ],
        "period": 300,
        "stat": "Average"
      }
    }
  ]
}
```

---

## ALERTS

```bash
# Email alerts on:
- High CPU (> 80%)
- High memory (> 85%)
- DB connection issues
- API errors (> 1%)
- Payment failures
- Low disk space (< 20%)
```

---

## CHECKLIST

- [ ] Sentry configured (backend + frontend)
- [ ] New Relic API monitoring
- [ ] CloudWatch logs aggregation
- [ ] Google Analytics installed
- [ ] Hotjar heatmaps
- [ ] UptimeRobot monitoring
- [ ] Dashboards created
- [ ] Alerts configured
- [ ] Team notified on incidents
- [ ] Runbook documented

---

**Próximo:** Fase 9 - Marketing

