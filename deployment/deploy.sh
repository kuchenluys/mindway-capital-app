#!/bin/bash
# Fase 8: Deployment to EC2

set -e

# Configuration
AWS_REGION=${AWS_REGION:-us-east-1}
ECR_REPOSITORY=${ECR_REPOSITORY:-mindway-capital-app}
EC2_HOST=${EC2_HOST:-mindway-capital-backend}
EC2_USER=${EC2_USER:-ec2-user}
PROJECT_NAME=${PROJECT_NAME:-mindway-capital}

echo "🚀 FASE 8: Deploying to EC2..."

# Get ECR credentials
echo "🔐 Logging into Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Build Docker image
echo "🔨 Building Docker image..."
ECR_REGISTRY=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com
IMAGE_TAG=$(git rev-parse --short HEAD)
IMAGE_URI=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

docker build -t $IMAGE_URI .

# Push to ECR
echo "📤 Pushing image to ECR: $IMAGE_URI"
docker push $IMAGE_URI

# Tag as latest
docker tag $IMAGE_URI $ECR_REGISTRY/$ECR_REPOSITORY:latest
docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

# Deploy to EC2 via Systems Manager
echo "🚀 Deploying to EC2 instance..."
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=$EC2_HOST" \
  --query 'Reservations[0].Instances[0].InstanceId' \
  --output text \
  --region $AWS_REGION)

if [ -z "$INSTANCE_ID" ] || [ "$INSTANCE_ID" == "None" ]; then
    echo "❌ EC2 instance not found: $EC2_HOST"
    exit 1
fi

echo "📍 EC2 Instance ID: $INSTANCE_ID"

# Send command to EC2
aws ssm send-command \
  --instance-ids $INSTANCE_ID \
  --document-name "AWS-RunShellScript" \
  --parameters "commands=[
    'cd /home/$EC2_USER/$PROJECT_NAME',
    'docker login -u AWS -p \$(aws ecr get-login-password --region $AWS_REGION) $ECR_REGISTRY',
    'docker pull $ECR_REGISTRY/$ECR_REPOSITORY:latest',
    'docker-compose down || true',
    'docker-compose up -d'
  ]" \
  --output text \
  --region $AWS_REGION

echo "✅ Deployment command sent to EC2!"
echo "📝 Check EC2 Systems Manager for command status"
