param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "mindway-capital"
)

$awsCmd = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

Write-Host "[*] FASE 9: Setting up CloudWatch Monitoring..." -ForegroundColor Green

# Create CloudWatch Log Group
$logGroupName = "/aws/ecs/$ProjectName"
Write-Host "Creating log group: $logGroupName" -ForegroundColor Yellow

$existingLogGroup = & $awsCmd logs describe-log-groups --log-group-name-prefix $logGroupName --region $Region --query "logGroups[?logGroupName=='$logGroupName']" 2>$null

if (-not $existingLogGroup -or $existingLogGroup -eq "[]") {
    & $awsCmd logs create-log-group --log-group-name $logGroupName --region $Region
    Write-Host "[OK] CloudWatch Log Group created: $logGroupName" -ForegroundColor Green
} else {
    Write-Host "[OK] CloudWatch Log Group already exists: $logGroupName" -ForegroundColor Green
}

# Set retention policy (30 days)
& $awsCmd logs put-retention-policy `
    --log-group-name $logGroupName `
    --retention-in-days 30 `
    --region $Region

Write-Host "[OK] Log retention set to 30 days" -ForegroundColor Green

# Create CloudWatch Alarms
Write-Host "`n[*] Creating CloudWatch Alarms..." -ForegroundColor Cyan

# High CPU Alarm
& $awsCmd cloudwatch put-metric-alarm `
    --alarm-name "$ProjectName-high-cpu" `
    --alarm-description "Alert when CPU usage is high" `
    --metric-name CPUUtilization `
    --namespace AWS/EC2 `
    --statistic Average `
    --period 300 `
    --threshold 80 `
    --comparison-operator GreaterThanThreshold `
    --evaluation-periods 2 `
    --region $Region 2>$null

Write-Host "[OK] CPU Alarm created" -ForegroundColor Green

# High Memory Alarm
& $awsCmd cloudwatch put-metric-alarm `
    --alarm-name "$ProjectName-high-memory" `
    --alarm-description "Alert when memory usage is high" `
    --metric-name MemoryUtilization `
    --namespace AWS/EC2 `
    --statistic Average `
    --period 300 `
    --threshold 85 `
    --comparison-operator GreaterThanThreshold `
    --evaluation-periods 2 `
    --region $Region 2>$null

Write-Host "[OK] Memory Alarm created" -ForegroundColor Green

# Unhealthy Hosts Alarm
$targetGroupArn = (& $awsCmd elbv2 describe-target-groups --names "$ProjectName-tg" --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text 2>$null)

if ($targetGroupArn -and $targetGroupArn -ne "None") {
    & $awsCmd cloudwatch put-metric-alarm `
        --alarm-name "$ProjectName-unhealthy-hosts" `
        --alarm-description "Alert when target group has unhealthy hosts" `
        --metric-name UnHealthyHostCount `
        --namespace AWS/ApplicationELB `
        --statistic Average `
        --period 300 `
        --threshold 1 `
        --comparison-operator GreaterThanOrEqualToThreshold `
        --evaluation-periods 1 `
        --dimensions Name=TargetGroup,Value="targetgroup/$ProjectName-tg/*" Name=LoadBalancer,Value="app/$ProjectName-alb/*" `
        --region $Region 2>$null

    Write-Host "[OK] Unhealthy Hosts Alarm created" -ForegroundColor Green
}

Write-Host "`n[DONE] CloudWatch Monitoring Setup Complete!" -ForegroundColor Green
