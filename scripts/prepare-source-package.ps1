$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$releaseRoot = Join-Path $projectRoot 'release'
$sourceZip = Join-Path $releaseRoot 'cybervault-source-collaboration.zip'

Write-Host 'Preparing source collaboration package...'
Push-Location $projectRoot
try {
  if (-not (Test-Path $releaseRoot)) {
    New-Item -ItemType Directory -Path $releaseRoot | Out-Null
  }

  if (Test-Path $sourceZip) {
    Remove-Item -LiteralPath $sourceZip -Force
  }

  $itemsToZip = @(
    'src',
    'docs',
    'scripts',
    'package.json',
    'package-lock.json',
    'vite.config.js',
    'vercel.json',
    'index.html',
    'index.php',
    '.htaccess',
    'README.md',
    '.env.example',
    '.env.xampp.example',
    '.env.vercel.example'
  )

  $assetFiles = Get-ChildItem -Path $projectRoot -File | Where-Object {
    $_.Extension -in @('.png', '.jpg', '.jpeg', '.svg', '.webp')
  } | ForEach-Object { $_.Name }

  $resolvedItems = @($itemsToZip + $assetFiles) |
    Where-Object { Test-Path $_ } |
    Select-Object -Unique

  if ($resolvedItems.Count -eq 0) {
    throw 'Tidak ada file source yang dapat di-zip.'
  }

  Compress-Archive -Path $resolvedItems -DestinationPath $sourceZip -Force
  Write-Host "Source collaboration package created: $sourceZip"
}
finally {
  Pop-Location
}
