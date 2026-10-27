# Build crusoe-frontend-godaddy.zip for GoDaddy / Airo upload (manual or gddy source upload).
# Excludes secrets, node_modules, and *.ps1 (GoDaddy blocks .ps1 in archives).
$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Out = Join-Path $Root "crusoe-frontend-godaddy.zip"

Push-Location $Root
try {
  if (Test-Path $Out) { Remove-Item $Out -Force }
  Write-Host "Running production build..."
  $env:NEXT_PUBLIC_API_URL = "https://backend.crusoetec.com/api"
  $env:NEXT_PUBLIC_SITE_URL = "https://crusoetec.com"
  $env:GOOGLE_SITE_VERIFICATION = "4j80TGzsCv74SR8j0DBcPdAdrFr3zvEbLzD2za2q2xc"
  npm run build
  Write-Host "Creating zip (includes .next, excludes cache)..."
  tar -a -c -f $Out `
    --exclude=node_modules `
    --exclude=.next/cache `
    --exclude=.env.local `
    --exclude=*.ps1 `
    --exclude=tsconfig.tsbuildinfo `
    --exclude=crusoe-frontend-godaddy.zip `
    .
  $mb = [math]::Round((Get-Item $Out).Length / 1MB, 2)
  Write-Host "Wrote $Out ($mb MB)"
} finally {
  Pop-Location
}
