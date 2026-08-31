# 🚀 Mindway Capital - Deployment Guide

## Overview

Este documento guía el despliegue completo de Mindway Capital en AWS con 10 fases.

## Prerequisites

- AWS CLI configurado con credenciales
- Docker instalado
- Git configurado
- Node.js 18+
- Permisos en AWS (ECR, ECS, EC2, ALB, CloudFront, Route53)

## Phases

### Fase 1-3: Completadas ✅
- QA Testing
- AWS Infrastructure (RDS, ElastiCache, EC2, IAM)
- CI/CD (GitHub Actions, Secrets)

### Fase 4: Containerización
Archivos creados:
- `Dockerfile` - Imagen Docker multi-stage
- `docker-compose.yml` - Orquestación local
- `.dockerignore` - Exclusiones de build

**Test local:**
```bash
docker-compose up
```

### Fase 5: ECR Setup
```bash
.\deployment\setup-aws.ps1
```

### Fase 6: ALB Configuration
Ejecutado en `setup-aws.ps1`

### Fase 7: CloudFront CDN
Configurado en `setup-aws.ps1`

### Fase 8: Deploy to EC2
```bash
./deployment/deploy.sh
```

### Fase 9: CloudWatch Monitoring
```bash
.\deployment\setup-monitoring.ps1
```

### Fase 10: Go Live
```bash
./deployment/go-live.sh
```

## Quick Start

### Environment Variables
Crear archivo `.env` (NO incluir en git):
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
DB_PASSWORD=<your-db-password>
REDIS_URL=redis://localhost:6379
NODE_ENV=production
```

**IMPORTANTE**: Usar GitHub Secrets en su lugar (ya configurados)

### Full Deployment (All Phases 4-10)

1. **Build & Test Locally**
```bash
npm install
npm run build
docker-compose up
# Test on http://localhost:3000
```

2. **Setup AWS Infrastructure**
```bash
.\deployment\setup-aws.ps1
```

3. **Build & Push to ECR**
```bash
./deployment/deploy.sh
```

4. **Configure Monitoring**
```bash
.\deployment\setup-monitoring.ps1
```

5. **Go Live**
```bash
./deployment/go-live.sh
```

## Architecture

```
Internet
   ↓
CloudFront (CDN)
   ↓
ALB (Application Load Balancer)
   ↓
EC2 Instance → Docker Container
   ↓           ↓
   ├─ RDS PostgreSQL
   ├─ ElastiCache Redis
   └─ CloudWatch Logs
```

## Monitoring

- **CloudWatch Logs**: `/aws/ecs/mindway-capital`
- **CloudWatch Alarms**:
  - `mindway-capital-high-cpu` (>80%)
  - `mindway-capital-high-memory` (>85%)
  - `mindway-capital-unhealthy-hosts`

## Rollback

Para revertir a la versión anterior:

```bash
aws ecs update-service \
  --cluster mindway-capital \
  --service mindway-app \
  --force-new-deployment

# Esperar a que se despliegue la versión anterior
```

## Troubleshooting

### Application not starting
```bash
aws logs tail /aws/ecs/mindway-capital --follow
```

### ECR login failed
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### ALB health check failing
Verificar que `/health` endpoint existe y retorna 200

### DNS not resolving
Verificar Route53 records o actualizar manualmente los DNS de tu registrador

## Support

Para reportar problemas, contactar al equipo de DevOps.

---

**Last Updated**: 2026-08-31  
**Version**: 1.0.0
