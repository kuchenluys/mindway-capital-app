param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "mindway-capital"
)

Write-Host "[*] Setting up AWS Infrastructure (Phases 5-7)" -ForegroundColor Cyan

# FASE 5: ECR Setup
Write-Host "`n[ECR] Creating ECR Repository..." -ForegroundColor Green

$ecrRepoName = "$ProjectName-app"
$ecrCheck = aws ecr describe-repositories --repository-names $ecrRepoName --region $Region 2>$null

if (-not $ecrCheck) {
    aws ecr create-repository `
        --repository-name $ecrRepoName `
        --region $Region `
        --image-scanning-configuration scanOnPush=true `
        --encryption-configuration encryptionType=AES
    Write-Host "[OK] ECR Repository created: $ecrRepoName" -ForegroundColor Green
} else {
    Write-Host "[OK] ECR Repository already exists: $ecrRepoName" -ForegroundColor Green
}

$ecrUri = (aws ecr describe-repositories --repository-names $ecrRepoName --region $Region --query 'repositories[0].repositoryUri' --output text)
Write-Host "ECR URI: $ecrUri" -ForegroundColor Cyan

# FASE 6: ALB Setup
Write-Host "`n[ALB] Configuring Application Load Balancer..." -ForegroundColor Green

$albName = "$ProjectName-alb"
$targetGroupName = "$ProjectName-tg"
$vpcId = (aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text --region $Region)
$subnets = (aws ec2 describe-subnets --filters Name=vpc-id,Values=$vpcId --query 'Subnets[*].SubnetId' --output text --region $Region)

Write-Host "VPC: $vpcId" -ForegroundColor Cyan
Write-Host "Subnets: $subnets" -ForegroundColor Cyan

# Get default security group for the VPC
$sgId = (aws ec2 describe-security-groups --filters Name=vpc-id,Values=$vpcId Name=group-name,Values=default --query 'SecurityGroups[0].GroupId' --output text --region $Region)
Write-Host "Security Group: $sgId" -ForegroundColor Cyan

# Convert subnets string to array
$subnetArray = $subnets.Split()

# Create ALB if not exists
$albCheck = aws elbv2 describe-load-balancers --names $albName --region $Region --query 'LoadBalancers[0].LoadBalancerArn' --output text 2>$null

if ($albCheck -eq "None" -or -not $albCheck) {
    Write-Host "Creating ALB: $albName..." -ForegroundColor Yellow
    $albResult = (aws elbv2 create-load-balancer `
        --name $albName `
        --subnets $subnetArray[0] $subnetArray[1] `
        --security-groups $sgId `
        --scheme internet-facing `
        --type application `
        --ip-address-type ipv4 `
        --region $Region `
        --output json | ConvertFrom-Json)
    $albArn = $albResult.LoadBalancers[0].LoadBalancerArn
    Write-Host "[OK] ALB Created: $albName" -ForegroundColor Green
} else {
    $albArn = $albCheck
    Write-Host "[OK] ALB Already exists: $albName" -ForegroundColor Green
}

Write-Host "ALB ARN: $albArn" -ForegroundColor Cyan

# Create Target Group
$tgCheck = aws elbv2 describe-target-groups --names $targetGroupName --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text 2>$null

if ($tgCheck -eq "None" -or -not $tgCheck) {
    Write-Host "Creating Target Group: $targetGroupName..." -ForegroundColor Yellow
    $tgResult = (aws elbv2 create-target-group `
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
        --output json | ConvertFrom-Json)
    $tgArn = $tgResult.TargetGroups[0].TargetGroupArn
    Write-Host "[OK] Target Group Created: $targetGroupName" -ForegroundColor Green
} else {
    $tgArn = $tgCheck
    Write-Host "[OK] Target Group Already exists: $targetGroupName" -ForegroundColor Green
}

Write-Host "Target Group ARN: $tgArn" -ForegroundColor Cyan

# Create ALB Listener
$listenerCheck = aws elbv2 describe-listeners --load-balancer-arn $albArn --region $Region --query 'Listeners[0].ListenerArn' --output text 2>$null

if ($listenerCheck -eq "None" -or -not $listenerCheck) {
    Write-Host "Creating Listener..." -ForegroundColor Yellow
    aws elbv2 create-listener `
        --load-balancer-arn $albArn `
        --protocol HTTP `
        --port 80 `
        --default-actions Type=forward,TargetGroupArn=$tgArn `
        --region $Region 2>$null
    Write-Host "[OK] ALB Listener configured" -ForegroundColor Green
} else {
    Write-Host "[OK] ALB Listener already exists" -ForegroundColor Green
}

# Get ALB DNS Name
$albDns = (aws elbv2 describe-load-balancers --load-balancer-arns $albArn --region $Region --query 'LoadBalancers[0].DNSName' --output text)

# FASE 7: CloudFront Setup
Write-Host "`n[CDN] Configuring CloudFront Distribution..." -ForegroundColor Green

Write-Host "ALB DNS: $albDns" -ForegroundColor Cyan
Write-Host "[OK] CloudFront configuration will be applied during deployment" -ForegroundColor Green

Write-Host "`n[DONE] AWS Infrastructure Setup Complete!" -ForegroundColor Green
Write-Host "Values:" -ForegroundColor Yellow
Write-Host "  ECR URI: $ecrUri" -ForegroundColor Cyan
Write-Host "  ALB ARN: $albArn" -ForegroundColor Cyan
Write-Host "  TG ARN: $tgArn" -ForegroundColor Cyan
Write-Host "  ALB DNS: $albDns" -ForegroundColor Cyan
