# Fase 8: Deployment to EC2

param(
    [string]$Region = "us-east-1",
    [string]$ECRRepository = "mindway-capital-app",
    [string]$EC2Host = "mindway-capital-backend",
    [string]$EC2User = "ec2-user",
    [string]$ProjectName = "mindway-capital"
)

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
$dockerCmd = "docker"

Write-Host "[*] FASE 8: Deploying to EC2..." -ForegroundColor Cyan

# Get ECR credentials
Write-Host "[*] Logging into Amazon ECR..." -ForegroundColor Yellow
$AccountId = (& $awsCmd sts get-caller-identity --query Account --output text)
$ECRRegistry = "$AccountId.dkr.ecr.$Region.amazonaws.com"

Write-Host "Account ID: $AccountId" -ForegroundColor Cyan
Write-Host "ECR Registry: $ECRRegistry" -ForegroundColor Cyan

$ecrPassword = (& $awsCmd ecr get-login-password --region $Region)
$ecrPassword | & $dockerCmd login --username AWS --password-stdin $ECRRegistry

# Build Docker image
Write-Host "[*] Building Docker image..." -ForegroundColor Yellow
$ImageTag = (git rev-parse --short HEAD)
$ImageUri = "$ECRRegistry/$ECRRepository" + ":$ImageTag"

Write-Host "Image URI: $ImageUri" -ForegroundColor Cyan
& $dockerCmd build -t $ImageUri .

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker build failed" -ForegroundColor Red
    exit 1
}

# Push to ECR
Write-Host "[*] Pushing image to ECR: $ImageUri" -ForegroundColor Yellow
& $dockerCmd push $ImageUri

if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Docker push failed" -ForegroundColor Red
    exit 1
}

# Tag as latest
& $dockerCmd tag $ImageUri "$ECRRegistry/$ECRRepository:latest"
& $dockerCmd push "$ECRRegistry/$ECRRepository:latest"

# Deploy to EC2 via Systems Manager
Write-Host "[*] Deploying to EC2 instance..." -ForegroundColor Yellow
$InstanceId = (& $awsCmd ec2 describe-instances `
  --filters "Name=tag:Name,Values=$EC2Host" `
  --query 'Reservations[0].Instances[0].InstanceId' `
  --output text `
  --region $Region)

if ($InstanceId -eq "None" -or -not $InstanceId) {
    Write-Host "[WARN] EC2 instance not found: $EC2Host (skip EC2 deployment)" -ForegroundColor Yellow
} else {
    Write-Host "EC2 Instance ID: $InstanceId" -ForegroundColor Cyan

    # Send command to EC2
    Write-Host "[*] Sending deployment command to EC2..." -ForegroundColor Yellow
    & $awsCmd ssm send-command `
      --instance-ids $InstanceId `
      --document-name "AWS-RunShellScript" `
      --parameters 'commands=["cd /home/ec2-user/mindway-capital","docker login -u AWS -p $(aws ecr get-login-password --region us-east-1) 757786127H00.dkr.ecr.us-east-1.amazonaws.com","docker pull 757786127H00.dkr.ecr.us-east-1.amazonaws.com/mindway-capital-app:latest","docker-compose down || true","docker-compose up -d"]' `
      --output text `
      --region $Region

    Write-Host "[OK] Deployment command sent to EC2!" -ForegroundColor Green
}

Write-Host "[OK] FASE 8 Complete!" -ForegroundColor Green
Write-Host "Docker image pushed to ECR: $ImageUri" -ForegroundColor Cyan
