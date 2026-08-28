# 🎯 PLAN DE EJECUCIÓN - Mindway Capital

**Del desarrollo al lanzamiento en producción**

---

## 📊 Visión General

```
SEMANA 1          SEMANA 2          SEMANA 3          SEMANA 4-5
┌─────────────────┬─────────────────┬─────────────────┬──────────────────┐
│ QA & Testing    │ AWS Setup       │ Deployment      │ Go-Live          │
│ Config & Secrets│ CI/CD Pipeline  │ Mobile Builds   │ Marketing Launch │
└─────────────────┴─────────────────┴─────────────────┴──────────────────┘
```

**Duración Total:** 4-5 semanas
**Team:** DevOps, Backend, Frontend, Mobile, QA, Product
**Budget:** ~$5,000 setup + $150-350/mes AWS

---

## 📅 SEMANA 1: QA & CONFIGURATION

### Lunes (Day 1)

#### Morning (2h) - Setup Local Testing
```bash
# Terminal 1
cd backend
npm run test:watch

# Terminal 2
cd frontend
npm run test:watch

# Terminal 3
npm run test:e2e
```

**Metrics Target:**
- ✅ Unit tests passing
- ✅ Coverage > 80%
- ✅ No critical ESLint errors

#### Afternoon (3h) - Generate Secrets

```bash
# Backend .env
JWT_SECRET=$(openssl rand -hex 32)
DATABASE_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
STRIPE_SECRET_KEY=sk_live_... # From Stripe
SENTRY_DSN=... # From Sentry

# Store in GitHub Actions
# Settings → Secrets and variables → Actions
```

**Deliverable:** Secure `.env` template created

---

### Tuesday (Day 2)

#### Morning (3h) - AWS Account Setup

```bash
# 1. Create AWS Account if not exists
# https://console.aws.amazon.com/console

# 2. Setup billing alerts
# Billing → Manage billing alerts
# Alert at $100, $500, $1000

# 3. Create IAM user for CI/CD
# Users → Create user → "github-actions"
# Permissions: EC2, RDS, ElastiCache, S3, IAM, CloudWatch

# 4. Save credentials
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# (Store in GitHub Actions secrets)
```

#### Afternoon (3h) - Database Preparation

```bash
# 1. Create database schema
cd backend
npm run db:migrate

# 2. Seed test data
npm run db:seed

# 3. Verify connections
psql -h localhost -U postgres -d mindway_capital -c "SELECT COUNT(*) FROM users;"

# 4. Create backups
npm run db:backup
```

**Deliverable:** Local database ready, migrations documented

---

### Wednesday (Day 3)

#### All Day (6h) - Load & Stress Testing

```bash
# Install k6 (load testing)
# https://k6.io/docs/getting-started/installation/

# Write test script
cat > backend/tests/load-test.js << 'EOF'
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 100 },
    { duration: '10m', target: 500 },
    { duration: '5m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

export default function() {
  let res = http.get('http://localhost:3000/api/trades');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
EOF

# Run test
k6 run backend/tests/load-test.js
```

**Metrics:**
- ✅ API handles 500 concurrent users
- ✅ p95 latency < 500ms
- ✅ Error rate < 1%

**Deliverable:** Load test report

---

### Thursday (Day 4)

#### Morning (3h) - Security Audit

```bash
# 1. OWASP Dependency Check
npm audit --audit-level=moderate

# 2. Secrets scan
# npm install --save-dev snyk
npm snyk scan

# 3. SSL/TLS check
# Will be done on Vercel + AWS

# 4. API security
# ✅ HTTPS only
# ✅ Rate limiting configured
# ✅ CORS locked to domain
# ✅ Auth required on protected routes
```

#### Afternoon (2h) - Performance Testing

```bash
# Lighthouse
npm run lighthouse

# Target scores:
# Performance: 90+
# Accessibility: 90+
# Best Practices: 90+
# SEO: 90+
```

**Deliverable:** Security audit passed, Lighthouse 90+

---

### Friday (Day 5)

#### Morning (3h) - Documentation & Checklists

```markdown
# Deployment Checklist

## Code Quality ✅
- [ ] All tests passing
- [ ] Coverage > 80%
- [ ] No security vulnerabilities
- [ ] Lighthouse 90+

## Infrastructure ✅
- [ ] AWS account created
- [ ] Database schemas verified
- [ ] Redis configured
- [ ] Backups tested

## Secrets ✅
- [ ] All .env variables set
- [ ] GitHub Actions secrets configured
- [ ] AWS credentials secured
- [ ] Database passwords strong (>32 chars)
```

#### Afternoon (2h) - Team Briefing

```
Meeting: Production Readiness Review (1h)
- Team overview
- Risk assessment
- Go/No-go decision
- Q&A

Outcome: GO or NO-GO for week 2
```

**Deliverable:** Week 1 summary report

---

## 📅 SEMANA 2: AWS DEPLOYMENT

### Monday (Day 6)

#### All Day (8h) - AWS Infrastructure Setup

```bash
# 1. Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# 2. Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24

# 3. Create RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier mindway-prod \
  --db-instance-class db.t3.small \
  --engine postgres \
  --allocated-storage 20 \
  --master-username postgres

# 4. Create ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id mindway-redis \
  --engine redis \
  --cache-node-type cache.t3.micro

# 5. Create EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name mindway-key

# 6. Setup security groups (firewall rules)
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp --port 5432 --source-cidr 10.0.0.0/16
```

**Deliverable:** AWS infrastructure created

---

### Tuesday (Day 7)

#### All Day (8h) - Backend Deployment

```bash
# 1. SSH to EC2 instance
ssh -i key.pem ubuntu@<EC2_IP>

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Clone repository
git clone https://github.com/mindway/mindway-capital.git
cd mindway-capital/backend

# 4. Install dependencies
npm install --production

# 5. Configure .env
sudo tee /opt/mindway/.env > /dev/null << EOF
DATABASE_URL=postgres://postgres:$DB_PASS@$RDS_HOST/mindway_capital
REDIS_URL=redis://:$REDIS_PASS@$REDIS_HOST:6379
NODE_ENV=production
PORT=3000
JWT_SECRET=$JWT_SECRET
STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
EOF

# 6. Setup PM2 (process manager)
npm install -g pm2
pm2 start ecosystem.config.js --name mindway-api
pm2 startup
pm2 save

# 7. Test API
curl http://localhost:3000/api/health
```

**Metrics:**
- ✅ API running
- ✅ Database connected
- ✅ Redis connected
- ✅ Logging working

**Deliverable:** Backend production-ready

---

### Wednesday (Day 8)

#### All Day (8h) - Frontend Deployment

```bash
# 1. Connect Vercel to GitHub
# https://vercel.com/dashboard
# Connect → mindway-capital repo

# 2. Configure environment
# Project settings → Environment variables
# VITE_API_URL=https://api.mindwaycapital.com
# VITE_STRIPE_PUBLIC_KEY=pk_live_...
# VITE_SENTRY_DSN=...

# 3. Setup custom domain
# Settings → Domains
# Add mindwaycapital.com
# Update DNS at registrar

# 4. Configure auto-deploy
# Git → Connected via GitHub
# Main branch auto-deploys

# 5. Trigger build
git push origin main
# Vercel auto-builds and deploys

# 6. Verify deployment
curl https://mindwaycapital.com
# Should load landing page
```

**Metrics:**
- ✅ Frontend deployed
- ✅ Custom domain working
- ✅ HTTPS active
- ✅ CDN caching enabled

**Deliverable:** Frontend production-ready

---

### Thursday (Day 9)

#### All Day (8h) - Mobile Build Preparation

```bash
# 1. Setup EAS (Expo Application Services)
cd mobile
npm install -g eas-cli
eas login

# 2. Configure app.json
cat > app.json << 'EOF'
{
  "expo": {
    "name": "Mindway Capital",
    "slug": "mindway-capital",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.mindwaycapital.ios"
    },
    "android": {
      "package": "com.mindwaycapital"
    }
  }
}
EOF

# 3. Create Apple Developer account ($99/year)
# https://developer.apple.com

# 4. Create Google Play account ($25 one-time)
# https://play.google.com/console

# 5. Build preview for testing
eas build -p ios --profile preview
eas build -p android --profile preview

# 6. Test on simulator/devices
```

**Deliverable:** Mobile build infrastructure ready

---

### Friday (Day 10)

#### Morning (3h) - Monitoring Setup

```bash
# 1. Sentry configuration
# https://sentry.io
# Create project → Get DSN

npm install @sentry/node @sentry/react

# backend/src/index.ts
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });

# 2. CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name api-error-rate \
  --alarm-description "Alert if error rate > 1%" \
  --metric-name Errors \
  --threshold 1.0

# 3. UptimeRobot
# https://uptimerobot.com
# Add monitors for:
# - https://mindwaycapital.com
# - https://api.mindwaycapital.com/health
```

#### Afternoon (2h) - Team Sync

**Deliverable:** Week 2 summary, Go/No-go for week 3

---

## 📅 SEMANA 3: FINAL DEPLOYMENT & TESTING

### Monday-Wednesday (Days 11-13)

**Integration Testing**
```bash
# 1. Test all critical flows
# - Sign up → Login → Trade → P&L
# - Payment flow → Subscription
# - Mobile app connects to API

# 2. Performance testing
# - API latency < 200ms
# - Database response time < 50ms
# - Frontend load < 3s

# 3. Security testing
# - SQL injection attempts → blocked
# - XSS attempts → blocked
# - Brute force login → rate limited
```

### Thursday (Day 14)

**Mobile Builds to Stores**
```bash
# iOS
eas build -p ios --profile production
# Auto-upload to TestFlight
# Testers: internal team → test → submit to App Review

# Android
eas build -p android --profile production
# Upload to Google Play Console → Internal Testing
# Testers: test → submit to Play Store
```

### Friday (Day 15)

**Pre-Launch Review**
```
Checklist:
☑ All environments working
☑ Database backups automated
☑ Monitoring alerts active
☑ On-call rotation set
☑ Incident response plan ready
☑ Marketing campaign ready
☑ Support team trained

Decision: 🟢 GO for launch
```

---

## 📅 SEMANA 4-5: GO-LIVE & STABILIZATION

### Monday (Day 16) - LAUNCH DAY

#### 6 Hours Before (Morning)

```bash
# Final checks
✅ Database health
✅ API responding
✅ Frontend loading
✅ Mobile builds submitted
✅ Monitoring active
✅ Team assembled
```

#### Launch Hour

```
T-0:00   Launch announcement posted
T+0:05   Monitor initial traffic
T+0:15   First users registering
T+1:00   Scale if traffic growing
T+4:00   Stable, shift to monitoring
```

#### Monitoring

```
First 24h:
- Every 5 min: Check Sentry errors
- Every 15 min: Check API latency
- Every 30 min: Check database
- Hourly: Check all metrics
```

### Tuesday-Friday (Days 17-20)

**Stabilization & Optimization**

```bash
# Day 1-2: Production support
# Monitor errors
# Fix critical bugs
# Optimize slow queries

# Day 3-4: Marketing
# Post launch updates
# Engage community
# Collect feedback

# Day 5: Review & plan
# Metrics dashboard
# Feature requests
# Next priorities
```

### Following Weeks

**Post-Launch Tasks**

```
Week 2:
- Scale infrastructure if needed
- Implement feedback
- Plan next features

Week 3:
- Optimize costs
- Expand marketing
- Add new features

Week 4+:
- Regular updates
- Community building
- Growth initiatives
```

---

## 💰 COST BREAKDOWN

| Item | Monthly | Notes |
|------|---------|-------|
| **AWS RDS** | $50-100 | db.t3.small PostgreSQL |
| **AWS ElastiCache** | $15-30 | cache.t3.micro Redis |
| **AWS EC2** | $30-50 | t3.medium (1 instance) |
| **AWS ALB** | $20 | Application Load Balancer |
| **AWS S3** | $10 | Backups & assets |
| **AWS CloudFront** | $10-30 | CDN for static files |
| **Vercel** | $20 | Pro plan frontend |
| **Stripe** | 2.9% + $0.30 | Transaction fees |
| **Sentry** | $29 | Error tracking |
| **New Relic** | $50 | APM monitoring |
| **SendGrid** | $20 | Email service |
| **UptimeRobot** | $10 | Uptime monitoring |
| **Domain** | $12/year | mindwaycapital.com |
| **SSL Certificate** | Free | AWS ACM |
| **Total** | **$270-400** | Per month |

---

## 👥 TEAM ASSIGNMENTS

| Role | Responsibility | Time |
|------|---|---|
| **DevOps Lead** | AWS setup, CI/CD, monitoring | 40h |
| **Backend Lead** | API deployment, database | 30h |
| **Frontend Lead** | Vercel setup, deployment | 20h |
| **Mobile Lead** | EAS builds, app store submission | 25h |
| **QA Lead** | Testing, validation, checklists | 35h |
| **Product** | Marketing, launch coordination | 20h |

**Total:** ~170 hours (~4-5 weeks for 1 person, or 2 weeks for full team)

---

## 📋 SUCCESS METRICS

**Launch Day:**
```
✅ 99.9% uptime in first 24h
✅ < 200ms API latency (p95)
✅ < 1% error rate
✅ > 100 sign-ups
```

**Week 1:**
```
✅ 500+ sign-ups
✅ 100+ active users
✅ > 90% payment success rate
✅ 0 critical bugs
```

**Month 1:**
```
✅ 5,000+ sign-ups
✅ 1,000+ active monthly users
✅ Positive community feedback
✅ < $400/month operational cost
```

---

## ⚠️ RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Database crash | P1 | Daily backups, read replicas |
| API outage | P1 | ALB health checks, auto-restart |
| Payment failures | P2 | Stripe API redundancy, retry logic |
| Security breach | P1 | HTTPS, rate limiting, WAF |
| High costs | Low | Reserved instances, cost monitoring |
| Slow performance | P2 | CDN, caching, database optimization |

---

## 📞 ESCALATION

```
Blocker found?
├─ Technical: Ping @tech-lead
├─ Budget: Ping @cto  
├─ Timeline: Ping @product
└─ All above: Call incident meeting
```

---

**Status:** 🟢 READY TO EXECUTE
**Last Updated:** 2026-08-27
**Approval:** Pending review

