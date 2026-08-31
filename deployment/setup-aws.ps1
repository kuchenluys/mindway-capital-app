# Fase 5-7: AWS Infrastructure Setup
# ECR + ALB + CloudFront

param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "mindway-capital"
)

Write-Host "🚀 Setting up AWS Infrastructure (Fases 5-7)" -ForegroundColor Cyan

# FASE 5: ECR Setup
Write-Host "`n📦 FASE 5: Creating ECR Repository..." -ForegroundColor Green

$ecrRepoName = "$ProjectName-app"
$ecrCheck = aws ecr describe-repositories --repository-names $ecrRepoName --region $Region 2>$null

if (-not $ecrCheck) {
    aws ecr create-repository `
        --repository-name $ecrRepoName `
        --region $Region `
        --image-scanning-configuration scanOnPush=true `
        --encryption-configuration encryptionType=AES
    Write-Host "✅ ECR Repository created: $ecrRepoName" -ForegroundColor Green
} else {
    Write-Host "✅ ECR Repository already exists: $ecrRepoName" -ForegroundColor Green
}

$ecrUri = (aws ecr describe-repositories --repository-names $ecrRepoName --region $Region --query 'repositories[0].repositoryUri' --output text)
Write-Host "📍 ECR URI: $ecrUri" -ForegroundColor Cyan

# FASE 6: ALB Setup
Write-Host "`n⚖️  FASE 6: Configuring Application Load Balancer..." -ForegroundColor Green

$albName = "$ProjectName-alb"
$targetGroupName = "$ProjectName-tg"
$vpcId = (aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text --region $Region)
$subnets = (aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId --query 'Subnets[*].SubnetId' --output text --region $Region)

Write-Host "📍 VPC: $vpcId" -ForegroundColor Cyan
Write-Host "📍 Subnets: $subnets" -ForegroundColor Cyan

# Create ALB if not exists
$albCheck = aws elbv2 describe-load-balancers --names $albName --region $Region 2>$null
if (-not $albCheck) {
    $albArn = (aws elbv2 create-load-balancer `
        --name $albName `
        --subnets $subnets.Split()[0] $subnets.Split()[1] `
        --security-groups (Get-SecurityGroupId) `
        --scheme internet-facing `
        --type application `
        --ip-address-type ipv4 `
        --region $Region `
        --query 'LoadBalancers[0].LoadBalancerArn' `
        --output text)
    Write-Host "✅ ALB Created: $albName" -ForegroundColor Green
} else {
    $albArn = (aws elbv2 describe-load-balancers --names $albName --region $Region --query 'LoadBalancers[0].LoadBalancerArn' --output text)
    Write-Host "✅ ALB Already exists: $albName" -ForegroundColor Green
}

# Create Target Group
$tgCheck = aws elbv2 describe-target-groups --names $targetGroupName --region $Region 2>$null
if (-not $tgCheck) {
    $tgArn = (aws elbv2 create-target-group `
        --name $targetGroupName `
        --protocol HTTP `
        --port 3000 `
        --vpc-id $vpcId `
        --health-check-protocol HTTP `
        --health-check-path /health `
        --health-check-interval-seconds 30 `
        --health-check-timeout-seconds 5 `
        --healthy-threshold-count 2 `
        --unhealthy-threshold-count 3 `
        --region $Region `
        --query 'TargetGroups[0].TargetGroupArn' `
        --output text)
    Write-Host "✅ Target Group Created: $targetGroupName" -ForegroundColor Green
} else {
    $tgArn = (aws elbv2 describe-target-groups --names $targetGroupName --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text)
    Write-Host "✅ Target Group Already exists: $targetGroupName" -ForegroundColor Green
}

# Create ALB Listener
aws elbv2 create-listener `
    --load-balancer-arn $albArn `
    --protocol HTTP `
    --port 80 `
    --default-actions Type=forward,TargetGroupArn=$tgArn `
    --region $Region 2>$null

Write-Host "✅ ALB Listener configured" -ForegroundColor Green

# FASE 7: CloudFront Setup
Write-Host "`n☁️  FASE 7: Configuring CloudFront Distribution..." -ForegroundColor Green

$albDns = (aws elbv2 describe-load-balancers --load-balancer-arns $albArn --region $Region --query 'LoadBalancers[0].DNSName' --output text)
Write-Host "📍 ALB DNS: $albDns" -ForegroundColor Cyan

# CloudFront config will be created via the deployment script
Write-Host "✅ CloudFront configuration will be applied during deployment" -ForegroundColor Green

Write-Host "`n✅ AWS Infrastructure Setup Complete (Fases 5-7)!" -ForegroundColor Cyan
Write-Host "📝 Save these values:" -ForegroundColor Yellow
Write-Host "   ECR URI: $ecrUri" -ForegroundColor Cyan
Write-Host "   ALB ARN: $albArn" -ForegroundColor Cyan
Write-Host "   TG ARN: $tgArn" -ForegroundColor Cyan
Write-Host "   ALB DNS: $albDns" -ForegroundColor Cyan
