# Push production public env vars to GoDaddy frontend app (PREVIEW + PUBLISH).
param(
  [ValidateSet("PREVIEW", "PUBLISH")]
  [string]$Variant = "PUBLISH",
  [switch]$AlsoPreview
)

$ErrorActionPreference = "Stop"
$AppId = "NODEJS-dj7kt4t2oo"

$secrets = @{
  NEXT_PUBLIC_API_URL        = "https://backend.crusoetec.com/api"
  NEXT_PUBLIC_SITE_URL       = "https://crusoetec.com"
  GOOGLE_SITE_VERIFICATION   = "4j80TGzsCv74SR8j0DBcPdAdrFr3zvEbLzD2za2q2xc"
}

function Sync-Variant([string]$TargetVariant) {
  Write-Host "=== Frontend secrets: $TargetVariant ==="
  foreach ($name in $secrets.Keys) {
    Write-Host "Updating $name"
    & gddy hosting secret update --app-id $AppId --name $name --value $secrets[$name] --variant $TargetVariant
    if ($LASTEXITCODE -ne 0) {
      & gddy hosting secret create --app-id $AppId --name $name --value $secrets[$name] --variant $TargetVariant
    }
  }
}

Sync-Variant $Variant
if ($AlsoPreview -and $Variant -ne "PREVIEW") {
  Sync-Variant "PREVIEW"
}

Write-Host "Done. Rebuild/republish frontend so NEXT_PUBLIC_* is baked into .next."
