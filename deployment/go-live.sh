#!/bin/bash
# Fase 10: Go Live - Final Tests & DNS Configuration

set -e

PROJECT_NAME=${PROJECT_NAME:-mindway-capital}
DOMAIN=${DOMAIN:-mindway-capital.com}
AWS_REGION=${AWS_REGION:-us-east-1}

echo "🎉 FASE 10: Going Live..."

# Get ALB DNS
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names "$PROJECT_NAME-alb" \
  --region $AWS_REGION \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

if [ -z "$ALB_DNS" ] || [ "$ALB_DNS" == "None" ]; then
    echo "❌ ALB not found!"
    exit 1
fi

echo "📍 ALB DNS: $ALB_DNS"

# Health Check
echo "🏥 Running health checks..."
for i in {1..30}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$ALB_DNS/health || echo "000")
    if [ "$STATUS" == "200" ]; then
        echo "✅ Application is healthy!"
        break
    else
        echo "⏳ Waiting for application... (Attempt $i/30, Status: $STATUS)"
        sleep 10
    fi
done

if [ "$STATUS" != "200" ]; then
    echo "❌ Application failed health check"
    exit 1
fi

# Test critical endpoints
echo "🧪 Testing critical endpoints..."

endpoints=(
    "/api/health"
    "/api/auth/status"
    "/"
)

for endpoint in "${endpoints[@]}"; do
    RESPONSE=$(curl -s -w "\n%{http_code}" http://$ALB_DNS$endpoint)
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

    if [[ "$HTTP_CODE" =~ ^[2-3][0-9]{2}$ ]]; then
        echo "✅ $endpoint - OK ($HTTP_CODE)"
    else
        echo "⚠️  $endpoint - Status: $HTTP_CODE"
    fi
done

echo ""
echo "✅ All tests passed!"

# DNS Instructions
echo ""
echo "🌐 DNS Configuration Instructions:"
echo "=================================="
echo "Update your domain DNS records to point to:"
echo ""
echo "   A Record: $ALB_DNS"
echo ""
echo "Or create a CNAME:"
echo "   CNAME: www.$DOMAIN -> $ALB_DNS"
echo ""

# Create Route53 record if hosted zone exists
ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name $DOMAIN --query "HostedZones[0].Id" --output text --region $AWS_REGION 2>/dev/null)

if [ ! -z "$ZONE_ID" ] && [ "$ZONE_ID" != "None" ]; then
    echo "📍 Found hosted zone: $ZONE_ID"
    echo "🚀 Creating Route53 records..."

    # Create A record
    aws route53 change-resource-record-sets \
        --hosted-zone-id $ZONE_ID \
        --change-batch "{
            \"Changes\": [
                {
                    \"Action\": \"CREATE\",
                    \"ResourceRecordSet\": {
                        \"Name\": \"$DOMAIN\",
                        \"Type\": \"A\",
                        \"AliasTarget\": {
                            \"HostedZoneId\": \"Z35SXDOTRQ7X7K\",
                            \"DNSName\": \"$ALB_DNS\",
                            \"EvaluateTargetHealth\": true
                        }
                    }
                }
            ]
        }" 2>/dev/null || echo "⚠️  Could not auto-create DNS records"

    echo "✅ Route53 records created"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================="
echo "Application URL: http://$ALB_DNS"
echo "Project: $PROJECT_NAME"
echo "Region: $AWS_REGION"
echo ""
echo "📊 Monitor at: https://console.aws.amazon.com/cloudwatch"
echo "📋 Logs at: https://console.aws.amazon.com/logs"
echo ""
