# Fase 9: CloudWatch Monitoring & Logging

param(
    [string]$Region = "us-east-1",
    [string]$ProjectName = "mindway-capital"
)

Write-Host "📊 FASE 9: Setting up CloudWatch Monitoring..." -ForegroundColor Green

# Create CloudWatch Log Group
$logGroupName = "/aws/ecs/$ProjectName"
$existingLogGroup = aws logs describe-log-groups --log-group-name-prefix $logGroupName --region $Region --query "logGroups[?logGroupName=='$logGroupName']" 2>$null

if (-not $existingLogGroup) {
    aws logs create-log-group --log-group-name $logGroupName --region $Region
    Write-Host "✅ CloudWatch Log Group created: $logGroupName" -ForegroundColor Green
} else {
    Write-Host "✅ CloudWatch Log Group already exists: $logGroupName" -ForegroundColor Green
}

# Set retention policy (30 days)
aws logs put-retention-policy `
    --log-group-name $logGroupName `
    --retention-in-days 30 `
    --region $Region

Write-Host "✅ Log retention set to 30 days" -ForegroundColor Green

# Create CloudWatch Alarms
Write-Host "`n⚠️  Creating CloudWatch Alarms..." -ForegroundColor Cyan

# High CPU Alarm
aws cloudwatch put-metric-alarm `
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

Write-Host "✅ CPU Alarm created" -ForegroundColor Green

# High Memory Alarm
aws cloudwatch put-metric-alarm `
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

Write-Host "✅ Memory Alarm created" -ForegroundColor Green

# Unhealthy Hosts Alarm
$targetGroupArn = (aws elbv2 describe-target-groups --names "$ProjectName-tg" --region $Region --query 'TargetGroups[0].TargetGroupArn' --output text 2>$null)
if ($targetGroupArn) {
    aws cloudwatch put-metric-alarm `
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

    Write-Host "✅ Unhealthy Hosts Alarm created" -ForegroundColor Green
}

Write-Host "`n✅ CloudWatch Monitoring Setup Complete (Fase 9)!" -ForegroundColor Cyan
