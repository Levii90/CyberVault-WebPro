$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseRoot = Join-Path $projectRoot 'release'
$stagingRoot = Join-Path $releaseRoot 'cyberpanel-deploy'
$releaseZip = Join-Path $releaseRoot 'cybervault-cyberpanel-deploy.zip'

$originalBasename = $env:VITE_ROUTER_BASENAME
$originalApiBaseUrl = $env:VITE_API_BASE_URL
$originalAuthMode = $env:VITE_AUTH_MODE

function Copy-RequiredItem {
  param(
    [string]$SourcePath,
    [string]$DestinationPath
  )

  if (-not (Test-Path $SourcePath)) {
    throw "Required path not found: $SourcePath"
  }

  if ((Get-Item $SourcePath).PSIsContainer) {
    Copy-Item -Path $SourcePath -Destination $DestinationPath -Recurse -Force
    return
  }

  $destinationDirectory = Split-Path -Parent $DestinationPath
  if (-not (Test-Path $destinationDirectory)) {
    New-Item -ItemType Directory -Path $destinationDirectory | Out-Null
  }

  Copy-Item -Path $SourcePath -Destination $DestinationPath -Force
}

Write-Host 'Preparing CyberPanel deploy package...'
Push-Location $projectRoot

try {
  $env:VITE_ROUTER_BASENAME = '/dist'
  $env:VITE_API_BASE_URL = '/backend/index.php'
  $env:VITE_AUTH_MODE = 'backend'

  npm run build

  if (Test-Path $stagingRoot) {
    Remove-Item -LiteralPath $stagingRoot -Recurse -Force
  }

  if (-not (Test-Path $releaseRoot)) {
    New-Item -ItemType Directory -Path $releaseRoot | Out-Null
  }

  if (Test-Path $releaseZip) {
    Remove-Item -LiteralPath $releaseZip -Force
  }

  New-Item -ItemType Directory -Path $stagingRoot | Out-Null

  Copy-RequiredItem -SourcePath (Join-Path $projectRoot 'index.php') -DestinationPath (Join-Path $stagingRoot 'index.php')
  Copy-RequiredItem -SourcePath (Join-Path $projectRoot '.htaccess') -DestinationPath (Join-Path $stagingRoot '.htaccess')
  Copy-RequiredItem -SourcePath (Join-Path $projectRoot 'dist') -DestinationPath (Join-Path $stagingRoot 'dist')
  Copy-RequiredItem -SourcePath (Join-Path $projectRoot 'backend') -DestinationPath (Join-Path $stagingRoot 'backend')
  Copy-RequiredItem -SourcePath (Join-Path $projectRoot 'README_DEPLOY_CYBERPANEL.md') -DestinationPath (Join-Path $stagingRoot 'README_DEPLOY_CYBERPANEL.md')
  Copy-RequiredItem -SourcePath (Join-Path $projectRoot 'database\cybervault_schema_for_cyberpanel.sql') -DestinationPath (Join-Path $stagingRoot 'database\cybervault_schema_for_cyberpanel.sql')

  $cachePath = Join-Path $stagingRoot 'backend\application\cache'
  $logsPath = Join-Path $stagingRoot 'backend\application\logs'

  if (Test-Path $cachePath) {
    Get-ChildItem -Path $cachePath -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  }

  if (Test-Path $logsPath) {
    Get-ChildItem -Path $logsPath -Force -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
  }

  $itemsToZip = Get-ChildItem -Path $stagingRoot -Force | ForEach-Object { $_.FullName }

  if ($itemsToZip.Count -eq 0) {
    throw 'Tidak ada file deploy CyberPanel yang dapat di-zip.'
  }

  Compress-Archive -Path $itemsToZip -DestinationPath $releaseZip -Force
  Write-Host "CyberPanel deploy package created: $releaseZip"
}
finally {
  $env:VITE_ROUTER_BASENAME = $originalBasename
  $env:VITE_API_BASE_URL = $originalApiBaseUrl
  $env:VITE_AUTH_MODE = $originalAuthMode
  Pop-Location
}
