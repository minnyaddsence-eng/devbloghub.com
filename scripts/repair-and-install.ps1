# Run from repo root: PowerShell -ExecutionPolicy Bypass -File .\scripts\repair-and-install.ps1
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot\..

Write-Host "Removing node_modules (close Dev Server / IDE file locks if this fails)..." -ForegroundColor Cyan
if (Test-Path -LiteralPath ".\node_modules") {
  Remove-Item -LiteralPath ".\node_modules" -Recurse -Force
}
if (Test-Path -LiteralPath ".\package-lock.json") {
  Remove-Item -LiteralPath ".\package-lock.json" -Force
}

Write-Host "npm install..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Try: npm run dev" -ForegroundColor Green
