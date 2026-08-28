# 📋 RUNBOOK OPERACIONAL - Mindway Capital

**Guía para operaciones, incidentes y troubleshooting en producción**

---

## 🚨 Tabla de Respuesta a Incidentes

### Severidad Levels

| Severidad | Descripción | Response Time | On-Call |
|-----------|-------------|---|---|
| **P1** | Outage completo, usuarios no pueden tradear | 5 min | Toda el equipo |
| **P2** | Feature crítica down, usuarios afectados | 15 min | Tech lead + Backend |
| **P3** | Degradación performance, feature no funciona | 1 hora | Backend on-call |
| **P4** | Errores aislados, no impacta mayoría | 4 horas | Backlog |

---

## 🔴 P1: OUTAGE COMPLETO

### Síntomas
- ❌ Users no pueden loguear
- ❌ Dashboard no carga
- ❌ Errors 500 generalizados
- ❌ Sentry showing mass errors

### Respuesta Inmediata (0-5 min)

```bash
# 1. Declarar incident
# Slack: #incidents → "P1: Dashboard down"

# 2. Verificar status
curl -I https://api.mindwaycapital.com/health
curl -I https://mindwaycapital.com

# 3. Check Sentry
# https://sentry.io/organizations/mindway/issues/
# Ver si hay patrón común

# 4. Check AWS CloudWatch
# RDS CPU, Connections, Replication lag
# EC2 instance health
# ALB target health
```

### Diagnóstico (5-15 min)

**Si Backend down:**
```bash
# SSH to EC2
ssh -i key.pem ubuntu@backend-prod-1.aws

# Check logs
pm2 logs
tail -f /var/log/mindway/error.log

# Check database connection
psql -h $DATABASE_HOST -U $DB_USER -d mindway_capital -c "SELECT 1;"

# Check Redis
redis-cli -h $REDIS_HOST PING

# Restart if needed
pm2 restart all
```

**Si Database down:**
```bash
# AWS RDS Console
# Check replication status
# Check disk space
# Check connections

# If corrupted:
# Trigger snapshot restore to latest
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier mindway-restore \
  --db-snapshot-identifier mindway-prod-$(date +%Y%m%d-%H%M%S)
```

**Si Frontend down:**
```bash
# Vercel Dashboard
# Check deployment status
# Check build logs
# Redeploy if needed
git push origin main
# Auto-deploys en Vercel
```

### Remediation

**Opción 1: Restart Services**
```bash
# Backend
ssh ubuntu@backend-prod-1
pm2 restart all
pm2 logs

# Esperar 2 min
curl https://api.mindwaycapital.com/health
```

**Opción 2: Rollback**
```bash
# Si reciente deployment broke things
git revert <commit-sha>
git push origin main

# Frontend: auto-redeploy en Vercel
# Backend: manual re-deploy a EC2
```

**Opción 3: Database Restore**
```bash
# Si data corruption
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier mindway-restore \
  --db-snapshot-identifier <latest-snapshot>

# Point ALB to new instance
# Update security groups
# Run migrations if needed
```

### Communication

```
🚨 P1 INCIDENT: API Down
🕐 Started: 14:23 UTC
👥 Impact: 100% users affected
🔧 Status: Investigating database connection
📱 Updates: Every 5 minutes in #incidents
```

### Post-Incident (1h after)

```bash
# 1. Verify all systems healthy
curl https://api.mindwaycapital.com/health
curl https://mindwaycapital.com

# 2. Check no more errors in Sentry
# https://sentry.io/organizations/mindway/issues/

# 3. Verify database integrity
psql -h $DB_HOST -U $DB_USER mindway_capital << EOF
SELECT COUNT(*) FROM trades;
SELECT COUNT(*) FROM positions;
SELECT MAX(updated_at) FROM positions;
EOF

# 4. Write incident report
# Template: /docs/incident-reports/
```

---

## 🟠 P2: FEATURE CRÍTICA DOWN

### Ejemplo: Trading feature no funciona

```bash
# 1. Repro el issue
# Test en production: crear trade → debe fallar

# 2. Check logs
# AWS CloudWatch Logs
# Buscar "POST /api/trades" errors

# 3. Identify root cause
# ¿API error?
# ¿Database error?
# ¿Validation error?

# 4. Fix
git checkout -b fix/trading-broken
# ... editar code ...
npm run test
git commit -m "fix(trading): handle stripe webhook correctly"
git push origin fix/trading-broken
# Crear PR → review → merge

# 5. Deploy
# Auto-deploys en Vercel (frontend)
# Manual EC2 redeploy (backend):
ssh ubuntu@backend-prod-1
cd /app/mindway-capital
git pull origin main
npm install --production
pm2 restart all
```

---

## 🟡 P3: DEGRADATION

### Síntomas
- Slow page loads (> 3s)
- Occasional timeouts
- High error rate (> 1%)

### Diagnóstico

```bash
# 1. Check CloudWatch metrics
# API latency (p95, p99)
# Database CPU
# Database connections

# 2. Check slow queries
ssh ubuntu@backend-prod-1
psql -h $DB_HOST -U $DB_USER mindway_capital << EOF
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
EOF

# 3. Check cache hit rate
redis-cli -h $REDIS_HOST INFO stats | grep hit_rate
```

### Mitigation

**Si database slow:**
```bash
# Agregar index
psql -h $DB_HOST -U $DB_USER mindway_capital << EOF
CREATE INDEX idx_trades_user_created 
ON trades(user_id, created_at DESC);
EOF

# Restart PostgreSQL
aws rds reboot-db-instance --db-instance-identifier mindway-prod
```

**Si memory leak:**
```bash
# Restart server durante low traffic (2am)
ssh ubuntu@backend-prod-1
pm2 restart all
pm2 logs
```

---

## 📊 Monitoreo Regular

### Daily Standup (9am UTC)

```
Checklist:
☑ No P1/P2 incidents overnight
☑ Error rate < 0.5%
☑ API latency p95 < 200ms
☑ Database CPU < 40%
☑ Disk space > 20%
☑ Backups completed
```

### Weekly Review (Monday)

```bash
# 1. Review metrics
# CloudWatch dashboard
# Sentry error trends
# User growth

# 2. Review incidents
# Any P1/P2 last week?
# Root cause analysis
# Preventive measures

# 3. Capacity planning
# Growing user base?
# Need to scale?
# Cost optimization?
```

### Monthly Deep Dive

```bash
# 1. Performance analysis
# Identify slow endpoints
# Slow queries
# Memory usage trends

# 2. Security audit
# Review access logs
# Check for suspicious patterns
# Verify backups encrypted

# 3. Cost review
# AWS spending trends
# Optimization opportunities
# Budget forecasting
```

---

## 🔧 Common Troubleshooting

### Users can't login

```bash
# 1. Check auth service
curl -X POST https://api.mindwaycapital.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'

# 2. Check JWT secret
ssh ubuntu@backend-prod-1
echo $JWT_SECRET

# 3. Check database user table
psql -h $DB_HOST -U $DB_USER mindway_capital << EOF
SELECT COUNT(*) FROM users;
SELECT * FROM users LIMIT 1;
EOF

# 4. Restart auth service
pm2 restart auth-service
```

### Trades not executing

```bash
# 1. Check trade service logs
ssh ubuntu@backend-prod-1
pm2 logs trade-service

# 2. Check if Stripe is up
curl https://status.stripe.com

# 3. Check database constraints
psql -h $DB_HOST -U $DB_USER mindway_capital << EOF
SELECT * FROM trades WHERE status = 'pending' LIMIT 5;
EOF

# 4. Manually process if stuck
# Usar admin endpoint si existe
curl -X POST https://api.mindwaycapital.com/admin/process-pending-trades \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### WebSocket not updating

```bash
# 1. Check Socket.io server
curl https://api.mindwaycapital.com/socket.io/?EIO=4&transport=polling

# 2. Check Redis (used by Socket.io)
redis-cli -h $REDIS_HOST
> INFO stats
> KEYS "*socket*"

# 3. Restart Socket.io
pm2 restart socket-service

# 4. Check browser console
# Dev tools → Console → any errors?
```

### Database connection errors

```bash
# 1. Verify credentials
psql -h $DB_HOST -U $DB_USER -d mindway_capital -c "SELECT version();"

# 2. Check RDS security group
# AWS Console → RDS → Security → Inbound rules
# Should allow port 5432 from EC2 security group

# 3. Check connection pool
ssh ubuntu@backend-prod-1
pm2 logs | grep "connection pool"

# 4. Increase pool size if needed
# Edit .env → DATABASE_POOL_MAX=20
# Restart service
```

---

## 📱 On-Call Rotation

### Escalation Path

```
L1: On-call (first response)
  ↓ (if unresolved in 30 min)
L2: Tech Lead (engineering decisions)
  ↓ (if P1, immediate)
L3: Engineering Manager (coordination)
  ↓ (if multiple teams needed)
L4: CTO (critical business decision)
```

### On-Call Responsibilities

- ✅ Respond to alerts within 5 min (P1) / 15 min (P2)
- ✅ Diagnose and remediate
- ✅ Communicate status
- ✅ Escalate if needed
- ✅ Document incident

### Handoff

```bash
# End of shift
# Review open incidents
# Document status for next on-call
# Post in #oncall-handoff Slack

📋 Handoff Report
🕐 Shift: 2026-08-27 00:00 - 08:00 UTC
✅ No incidents
✅ All systems green
📊 Error rate: 0.02%
🔔 Next on-call: @engineer-b
```

---

## 🔐 Credentials & Access

### Secrets Management

```bash
# Backend .env
DATABASE_URL=postgres://user:pass@host/db
REDIS_URL=redis://host:6379
JWT_SECRET=super-secret-key
STRIPE_SECRET_KEY=sk_live_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Stored in:
# 1. GitHub Actions secrets
# 2. AWS Secrets Manager
# 3. EC2 instance /opt/mindway/.env
# Never in git!
```

### SSH Access

```bash
# Add to ~/.ssh/config
Host mindway-prod
  HostName backend-prod-1.ec2.amazonaws.com
  User ubuntu
  IdentityFile ~/.ssh/mindway-key.pem
  StrictHostKeyChecking no

# Connect
ssh mindway-prod
```

---

## 📞 Emergency Contacts

| Role | Name | Slack | Phone |
|------|------|-------|-------|
| Tech Lead | @tech-lead | @tech | +1-555-0001 |
| Backend Lead | @backend-lead | @backend | +1-555-0002 |
| DevOps | @devops | @devops | +1-555-0003 |
| CTO | @cto | @cto | +1-555-0004 |

---

## 📚 Useful Links

- [AWS Console](https://console.aws.amazon.com)
- [Sentry Errors](https://sentry.io/organizations/mindway/issues/)
- [CloudWatch Logs](https://console.aws.amazon.com/cloudwatch)
- [Vercel Deployments](https://vercel.com/mindway/mindway-capital)
- [Status Page](https://status.mindwaycapital.com)
- [Slack #incidents](slack://channel/C123456)

---

**Last Updated:** 2026-08-27
**Maintainer:** DevOps Team
**Questions?** Post en #operations Slack

