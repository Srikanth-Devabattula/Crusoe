# Build crusoe-backend-godaddy.zip for GoDaddy / Airo upload.
# Excludes secrets, node_modules, and *.ps1 (GoDaddy blocks .ps1 in archives).
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Out = Join-Path $Root "crusoe-backend-godaddy.zip"

Push-Location $Root
try {
  if (Test-Path $Out) { Remove-Item $Out -Force }
  Write-Host "Running prisma generate..."
  npx prisma generate
  Write-Host "Creating zip..."
  tar -a -c -f $Out `
    --exclude=node_modules `
    --exclude=.env `
    --exclude=.env.* `
    --exclude=*.ps1 `
    --exclude=crusoe-backend-godaddy.zip `
    --exclude=crusoe-backend-godaddy `
    .
  $mb = [math]::Round((Get-Item $Out).Length / 1MB, 2)
  Write-Host "Wrote $Out ($mb MB)"
} finally {
  Pop-Location
}
