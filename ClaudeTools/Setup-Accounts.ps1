# ============================================================
# STEP 1 — Setup-Accounts.ps1
# Run this once per account to save its credentials.
#
# HOW TO USE:
#   1. Make sure you are logged into the account you want to save
#   2. Run:  .\Setup-Accounts.ps1
#   3. Give the account a name when prompted
#   4. Logout, login to your 2nd account, run this script again
# ============================================================

$ClaudeDir   = "E:\AiLearningPath\.claude"
$ToolkitDir  = "E:\AiLearningPath\ClaudeTools"
$AccountsDir = "E:\AiLearningPath\ClaudeTools\accounts"

# ── Create folders if missing ─────────────────────────────────
foreach ($dir in @($ToolkitDir, $AccountsDir, "$ToolkitDir\checkpoints")) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         CLAUDE ACCOUNT SETUP TOOL                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Verify .claude folder exists ──────────────────────────────
if (-not (Test-Path "$ClaudeDir\settings.local.json")) {
    Write-Host "❌ No credentials found at $ClaudeDir\settings.local.json" -ForegroundColor Red
    Write-Host ""
    Write-Host "   Please login first by running:  claude" -ForegroundColor Yellow
    Write-Host "   Then run this script again." -ForegroundColor Yellow
    exit 1
}

# ── Show existing saved accounts ──────────────────────────────
$saved = Get-ChildItem -Path $AccountsDir -Directory -ErrorAction SilentlyContinue
if ($saved.Count -gt 0) {
    Write-Host "📁 Already saved accounts:" -ForegroundColor White
    foreach ($acc in $saved) { Write-Host "   • $($acc.Name)" -ForegroundColor Gray }
    Write-Host ""
}

# ── Get account name ──────────────────────────────────────────
Write-Host "💡 You are currently logged in. Give this account a name." -ForegroundColor Yellow
Write-Host "   Example: Account1_Main  or  Account2_Backup" -ForegroundColor Gray
Write-Host ""
$name = Read-Host "  Account name"
if ([string]::IsNullOrWhiteSpace($name)) { $name = "Account_$(Get-Date -Format 'HHmm')" }
$safeName = $name -replace '[\\/:*?"<>| ]', '_'

$savePath = "$AccountsDir\$safeName"

# ── Save credentials ──────────────────────────────────────────
Write-Host ""
Write-Host "💾 Saving credentials for '$safeName'..." -ForegroundColor Yellow

if (Test-Path $savePath) {
    Remove-Item $savePath -Recurse -Force
}
New-Item -ItemType Directory -Path $savePath | Out-Null

# Copy only the credential files (not skills folder to save space)
Copy-Item "$ClaudeDir\settings.json"       "$savePath\settings.json"
Copy-Item "$ClaudeDir\settings.local.json" "$savePath\settings.local.json"
$safeName | Out-File "$savePath\label.txt" -Encoding UTF8

Write-Host "  ✅ Saved → $savePath" -ForegroundColor Green
Write-Host ""

# ── Show all accounts now ─────────────────────────────────────
$all = Get-ChildItem -Path $AccountsDir -Directory
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "📋 All saved accounts ($($all.Count)):" -ForegroundColor Cyan
foreach ($acc in $all) { Write-Host "   ✅ $($acc.Name)" -ForegroundColor Green }
Write-Host ""
Write-Host "👉 To save another account:" -ForegroundColor Yellow
Write-Host "   1. Run:  claude logout  (in a new PowerShell)" -ForegroundColor Gray
Write-Host "   2. Run:  claude          (login with 2nd account)" -ForegroundColor Gray
Write-Host "   3. Run:  .\Setup-Accounts.ps1  again" -ForegroundColor Gray
Write-Host ""
Write-Host "👉 When credits die, run:  .\Save-Checkpoint.ps1" -ForegroundColor Yellow
Write-Host "👉 To resume on new account:  .\Switch-And-Resume.ps1" -ForegroundColor Yellow
Write-Host ""
