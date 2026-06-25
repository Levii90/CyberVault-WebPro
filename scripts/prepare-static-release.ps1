$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseRoot = Join-Path $projectRoot 'release'
$releaseZip = Join-Path $releaseRoot 'cybervault-static-release.zip'

Write-Host 'Building static frontend release...'
Push-Location $projectRoot
try {
  npm run build

  if (-not (Test-Path $releaseRoot)) {
    New-Item -ItemType Directory -Path $releaseRoot | Out-Null
  }

  if (Test-Path $releaseZip) {
    Remove-Item -LiteralPath $releaseZip -Force
  }

  $itemsToZip = @(
    (Join-Path $projectRoot 'dist'),
    (Join-Path $projectRoot 'index.php'),
    (Join-Path $projectRoot '.htaccess'),
    (Join-Path $projectRoot 'docs\static-zip-release.md')
  ) | Where-Object { Test-Path $_ }

  if ($itemsToZip.Count -eq 0) {
    throw 'Tidak ada file release yang dapat di-zip.'
  }

  Compress-Archive -Path $itemsToZip -DestinationPath $releaseZip -Force
  Write-Host "Static release created: $releaseZip"
}
finally {
  Pop-Location
}
