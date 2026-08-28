# ☁️ FASE 3: BACKEND DEPLOYMENT (AWS)

**Duración:** 2-3 días  
**Prioridad:** 🔴 CRÍTICA  
**Status:** ⏳ A COMENZAR

---

## 📋 OPCIÓN RECOMENDADA: AWS (Producción)

---

## 🗄️ PASO 1: SETUP DATABASE (RDS)

### Crear instancia PostgreSQL:

```bash
# Usar AWS Console o AWS CLI
aws rds create-db-instance \
  --db-instance-identifier mindway-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.7 \
  --master-username postgres \
  --master-user-password YourSuperStrongPassword123! \
  --allocated-storage 100 \
  --storage-type gp2 \
  --backup-retention-period 30 \
  --multi-az \
  --publicly-accessible false \
  --enable-cloudwatch-logs-exports postgresql
```

### Esperar a que esté disponible (~5 minutos):

```bash
# Verificar estado
aws rds describe-db-instances \
  --db-instance-identifier mindway-prod-db \
  --query 'DBInstances[0].DBInstanceStatus'
```

### Guardar endpoint:
```
Endpoint: mindway-prod-db.c4kzpqj3c4jk.us-east-1.rds.amazonaws.com:5432
Database: postgres
Username: postgres
Password: YourSuperStrongPassword123!
```

### Crear databases y user:

```bash
# Conectar a PostgreSQL
psql -h mindway-prod-db.c4kzpqj3c4jk.us-east-1.rds.amazonaws.com -U postgres

# Una vez conectado:
CREATE DATABASE mindway_capital;
CREATE USER mindway_user WITH PASSWORD 'UserPassword123!';
GRANT ALL PRIVILEGES ON DATABASE mindway_capital TO mindway_user;
ALTER DATABASE mindway_capital OWNER TO mindway_user;
```

---

## 💾 PASO 2: SETUP REDIS CACHE

```bash
# Crear ElastiCache cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id mindway-prod-cache \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 6.2.14 \
  --num-cache-nodes 1 \
  --port 6379 \
  --cache-parameter-group-name default.redis6.x
```

### Guardar endpoint:
```
Endpoint: mindway-prod-cache.c4kzpqj3c4jk.ng.0001.use1.cache.amazonaws.com:6379
Password: (auth disabled para private VPC)
```

---

## 🔑 PASO 3: SETUP IAM ROLES

Crear role para EC2:

```bash
# Crear policy JSON
cat > policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::mindway-capital-prod/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:us-east-1:*:secret:mindway/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData",
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
EOF

# Crear role
aws iam create-role \
  --role-name mindway-ec2-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

# Attach policy
aws iam put-role-policy \
  --role-name mindway-ec2-role \
  --policy-name mindway-policy \
  --policy-document file://policy.json

# Crear instance profile
aws iam create-instance-profile --instance-profile-name mindway-ec2-profile
aws iam add-role-to-instance-profile \
  --instance-profile-name mindway-ec2-profile \
  --role-name mindway-ec2-role
```

---

## 🖥️ PASO 4: LAUNCH EC2 INSTANCE

```bash
# Crear security group
aws ec2 create-security-group \
  --group-name mindway-backend-sg \
  --description "Security group for Mindway backend"

# Agregar reglas de ingress
aws ec2 authorize-security-group-ingress \
  --group-name mindway-backend-sg \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
  --group-name mindway-backend-sg \
  --protocol tcp \
  --port 22 \
  --cidr YOUR_IP/32  # Reemplazar con tu IP

# Lanzar instancia
aws ec2 run-instances \
  --image-id ami-0a8e758f5e873d1c1 \
  --instance-type t3.medium \
  --key-name mindway-key-pair \
  --iam-instance-profile Name=mindway-ec2-profile \
  --security-groups mindway-backend-sg \
  --user-data file://user-data.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=mindway-backend-prod}]'
```

### Crear `user-data.sh`:

```bash
#!/bin/bash
set -e

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install git
sudo apt install -y git

# Clone repository
cd /home/ubuntu
git clone https://github.com/yourusername/mindway-capital.git
cd mindway-capital/backend

# Install dependencies
npm ci --production

# Setup environment
cat > .env << 'ENVEOF'
NODE_ENV=production
DATABASE_URL=postgresql://mindway_user:UserPassword123!@mindway-prod-db.c4kzpqj3c4jk.us-east-1.rds.amazonaws.com:5432/mindway_capital
REDIS_URL=redis://mindway-prod-cache.c4kzpqj3c4jk.ng.0001.use1.cache.amazonaws.com:6379
JWT_SECRET=8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e
STRIPE_SECRET_KEY=sk_live_...
ENVEOF

# Start with PM2
sudo pm2 start npm --name "mindway-backend" -- start
sudo pm2 startup
sudo pm2 save

# Setup logrotate
sudo pm2 logrotate -u ubuntu
```

---

## 🔗 PASO 5: SETUP LOAD BALANCER & AUTO-SCALING

```bash
# Crear target group
aws elbv2 create-target-group \
  --name mindway-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-12345678

# Crear ALB
aws elbv2 create-load-balancer \
  --name mindway-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678 \
  --scheme internet-facing

# Agregar listener
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/app/mindway-alb/abc123def456 \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/mindway-tg/abc123def456
```

---

## 🔐 PASO 6: SETUP SSL/TLS (HTTPS)

```bash
# Solicitar certificado en ACM
aws acm request-certificate \
  --domain-name api.mindwaycapital.com \
  --subject-alternative-names "*.mindwaycapital.com" \
  --validation-method DNS

# Validar dominio (seguir pasos en AWS Console)

# Una vez validado, agregar listener HTTPS
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=...

# Redirigir HTTP a HTTPS
# (Se hace en ALB listener modificando HTTP listener)
```

---

## 🌐 PASO 7: SETUP CDN (CLOUDFRONT)

```bash
# Crear distribución
aws cloudfront create-distribution \
  --origin-domain-name mindway-alb-123456.us-east-1.elb.amazonaws.com \
  --default-root-object index.html
```

---

## 📊 PASO 8: MONITORING & LOGGING

```bash
# CloudWatch Logs
aws logs create-log-group --log-group-name /mindway/backend/production
aws logs create-log-stream --log-group-name /mindway/backend/production --log-stream-name app

# CloudWatch Alarms
aws cloudwatch put-metric-alarm \
  --alarm-name mindway-backend-high-cpu \
  --alarm-description "Alert on high CPU usage" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Setup Sentry
npm install @sentry/node @sentry/tracing

# En backend/src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: 'production'
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Database creada y conectada
- [ ] Redis cache configurado
- [ ] IAM roles creados
- [ ] EC2 instance lanzada
- [ ] PM2 ejecutándose correctamente
- [ ] Load balancer funcionando
- [ ] SSL/TLS certificado instalado
- [ ] CloudFront distribuido
- [ ] Monitoring activo
- [ ] Backups automatizados
- [ ] Logging centralizado

---

## 🧪 VERIFICAR DEPLOYMENT

```bash
# Verificar que el backend responde
curl -X GET https://api.mindwaycapital.com/health

# Respuesta esperada:
# {"status":"ok","timestamp":"2026-08-27T10:30:00Z","uptime":12345}

# Verificar logs
aws logs tail /mindway/backend/production --follow

# Verificar métricas
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2026-08-27T00:00:00Z \
  --end-time 2026-08-27T23:59:59Z \
  --period 300 \
  --statistics Average
```

---

**Estado:** ⏳ A EJECUTAR  
**Próximo:** Fase 4 - Frontend Deployment (Vercel)
