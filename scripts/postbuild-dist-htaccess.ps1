$distPath = Join-Path $PSScriptRoot '..\dist'
$targetPath = Join-Path $distPath '.htaccess'

if (-not (Test-Path $distPath)) {
  throw "Dist folder not found: $distPath"
}

$content = @'
Options -Indexes

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /CyberVault-v1.0/CyberVault-WebPro/dist/

  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  RewriteRule . index.html [L]
</IfModule>
'@

Set-Content -LiteralPath $targetPath -Value $content -Encoding ASCII
Write-Output "Created $targetPath"
