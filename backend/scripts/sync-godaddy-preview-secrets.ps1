# Push backend/.env values to GoDaddy Node secrets (testing).
# Usage (from repo root or backend):
#   cd D:\crusoetech\backend
#   .\scripts\sync-godaddy-preview-secrets.ps1
#   .\scripts\sync-godaddy-preview-secrets.ps1 -Variant PUBLISH
#   .\scripts\sync-godaddy-preview-secrets.ps1 -Variant PREVIEW -AlsoPublish
#
# Set DATABASE_URL in GoDaddy Secrets (PUBLISH). Do not include backend/.env in deploy zip.
#
# Requires: gddy on PATH, gddy auth login, app NODEJS-11bh9ccomq

param(
  [ValidateSet("PREVIEW", "PUBLISH")]
  [string]$Variant = "PREVIEW",
  [switch]$AlsoPublish,
  # Hosted production uses injected DB_* — do not push cPanel DATABASE_URL from .env unless intentional.
  [switch]$IncludeDatabaseUrl
)

$ErrorActionPreference = "Stop"
$AppId = "NODEJS-11bh9ccomq"
$EnvFile = Join-Path (Split-Path $PSScriptRoot -Parent) ".env"

if (-not (Test-Path $EnvFile)) {
  Write-Error "Missing $EnvFile"
}

$envMap = @{}
Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $eq = $line.IndexOf("=")
  if ($eq -lt 1) { return }
  $key = $line.Substring(0, $eq).Trim()
  $val = $line.Substring($eq + 1).Trim()
  if ($val.Length -ge 2 -and $val.StartsWith('"') -and $val.EndsWith('"')) {
    $val = $val.Substring(1, $val.Length - 2)
  }
  $envMap[$key] = $val
}

# Production frontend (CORS / cookies)
$envMap["CLIENT_URL"] = "https://crusoetec.com,https://www.crusoetec.com"

$dbUrl = $envMap["DATABASE_URL"]
if ($dbUrl -and $dbUrl -notmatch ":\d+/") {
  $envMap["DATABASE_URL"] = $dbUrl -replace "(/[^/]+)$", ":3306`$1"
}

$secretNames = @(
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_NAME",
  "ADMIN_BOOTSTRAP_PASSWORD",
  "CLIENT_URL",
  "NOTIFY_EMAIL",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "SMTP_TLS_REJECT_UNAUTHORIZED"
)

if ($IncludeDatabaseUrl) {
  $secretNames = @("DATABASE_URL") + $secretNames
} else {
  Write-Host "Skipping DATABASE_URL (production uses hosted DB_* secrets)."
}

function Sync-SecretsForVariant([string]$TargetVariant) {
  Write-Host ""
  Write-Host "=== Variant: $TargetVariant ==="
  foreach ($name in $secretNames) {
    if (-not $envMap.ContainsKey($name) -or [string]::IsNullOrWhiteSpace($envMap[$name])) {
      Write-Host "Skip (not in .env): $name"
      continue
    }
    Write-Host "Updating secret: $name"
    & gddy hosting secret update --app-id $AppId --name $name --value $envMap[$name] --variant $TargetVariant
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Create (first time): $name"
      & gddy hosting secret create --app-id $AppId --name $name --value $envMap[$name] --variant $TargetVariant
    }
  }
}

Sync-SecretsForVariant $Variant
if ($AlsoPublish -and $Variant -ne "PUBLISH") {
  Sync-SecretsForVariant "PUBLISH"
}

Write-Host ""
Write-Host "Done. If PREVIEW did not reload, use dashboard Update Preview."
Write-Host "API health (custom): https://backend.crusoetec.com/api/health"
