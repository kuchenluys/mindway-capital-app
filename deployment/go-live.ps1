param(
    [string]$ProjectName = "mindway-capital",
    [string]$Domain = "mindway-capital.com",
    [string]$Region = "us-east-1"
)

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

Write-Host "[*] FASE 10: Going Live..." -ForegroundColor Cyan

# Get ALB DNS
$ALB_DNS = (& $awsCmd elbv2 describe-load-balancers `
  --names "$ProjectName-alb" `
  --region $Region `
  --query 'LoadBalancers[0].DNSName' `
  --output text)

if ($ALB_DNS -eq "None" -or -not $ALB_DNS) {
    Write-Host "[ERROR] ALB not found!" -ForegroundColor Red
    exit 1
}

Write-Host "ALB DNS: $ALB_DNS" -ForegroundColor Cyan

# Health Check
Write-Host "`n[*] Running health checks..." -ForegroundColor Yellow
$healthCheckURL = "http://$ALB_DNS/health"
$attempts = 0
$maxAttempts = 30

while ($attempts -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri $healthCheckURL -TimeoutSec 5 -ErrorAction SilentlyContinue
        $STATUS = $response.StatusCode
    } catch {
        $STATUS = "000"
    }

    if ($STATUS -eq 200) {
        Write-Host "[OK] Application is healthy!" -ForegroundColor Green
        break
    } else {
        $attempts++
        Write-Host "[*] Waiting for application... (Attempt $attempts/$maxAttempts, Status: $STATUS)"
        Start-Sleep -Seconds 10
    }
}

if ($STATUS -ne 200) {
    Write-Host "[WARN] Application failed health check (Status: $STATUS)" -ForegroundColor Yellow
}

# Test critical endpoints
Write-Host "`n[*] Testing critical endpoints..." -ForegroundColor Yellow

$endpoints = @("/api/health", "/api/auth/status", "/")

foreach ($endpoint in $endpoints) {
    try {
        $url = "http://$ALB_DNS$endpoint"
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -ErrorAction SilentlyContinue
        $httpCode = $response.StatusCode
    } catch {
        $httpCode = "ERROR"
    }

    if ($httpCode -match "^[2-3]\d{2}$") {
        Write-Host "[OK] $endpoint - OK ($httpCode)" -ForegroundColor Green
    } else {
        Write-Host "[WARN] $endpoint - Status: $httpCode" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[*] DNS Configuration Instructions:" -ForegroundColor Cyan
Write-Host "=================================="
Write-Host "Update your domain DNS records to point to:"
Write-Host ""
Write-Host "   A Record: $ALB_DNS"
Write-Host ""
Write-Host "Or create a CNAME:"
Write-Host "   CNAME: www.$Domain -> $ALB_DNS"
Write-Host ""

# Create Route53 record if hosted zone exists
$ZONE_ID = (& $awsCmd route53 list-hosted-zones-by-name --dns-name $Domain --query "HostedZones[0].Id" --output text --region $Region 2>$null)

if ($ZONE_ID -and $ZONE_ID -ne "None") {
    Write-Host "[*] Found hosted zone: $ZONE_ID" -ForegroundColor Cyan
    Write-Host "[*] Creating Route53 records..." -ForegroundColor Yellow

    $zoneName = $ZONE_ID.Split("/")[-1]

    $changeJson = @"
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$Domain",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z35SXDOTRQ7X7K",
                    "DNSName": "$ALB_DNS",
                    "EvaluateTargetHealth": true
                }
            }
        }
    ]
}
"@

    $changeJson | & $awsCmd route53 change-resource-record-sets `
        --hosted-zone-id $zoneName `
        --change-batch file:///dev/stdin `
        --region $Region 2>$null

    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Route53 records created" -ForegroundColor Green
    } else {
        Write-Host "[WARN] Could not auto-create DNS records" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[DONE] DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "=================================="
Write-Host "Application URL: http://$ALB_DNS"
Write-Host "Project: $ProjectName"
Write-Host "Region: $Region"
Write-Host ""
Write-Host "Monitor at: https://console.aws.amazon.com/cloudwatch"
Write-Host "Logs at: https://console.aws.amazon.com/logs"
Write-Host ""
