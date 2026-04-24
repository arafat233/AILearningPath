# ============================================================
# STEP 3 — Switch-And-Resume.ps1
# Swaps credentials to chosen account + resumes Claude
# with full checkpoint context. One command does it all!
# ============================================================

$ClaudeDir     = "E:\AiLearningPath\.claude"
$AccountsDir   = "E:\AiLearningPath\ClaudeTools\accounts"
$CheckpointDir = "E:\AiLearningPath\ClaudeTools\checkpoints"
$LatestFile    = "$CheckpointDir\LATEST.json"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      SWITCH ACCOUNT + RESUME WORK                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ════════════════════════════════════════════════════════════
# STEP A — PICK ACCOUNT
# ════════════════════════════════════════════════════════════
Write-Host "👤 Which account to switch to?" -ForegroundColor Yellow
Write-Host ""

$accounts = Get-ChildItem -Path $AccountsDir -Directory -ErrorAction SilentlyContinue
if ($accounts.Count -eq 0) {
    Write-Host "❌ No saved accounts found!" -ForegroundColor Red
    Write-Host "   Run .\Setup-Accounts.ps1 first." -ForegroundColor Yellow
    exit 1
}

$i = 1
$map = @{}
foreach ($acc in $accounts) {
    Write-Host "   [$i] $($acc.Name)" -ForegroundColor Cyan
    $map[$i] = $acc.FullName
    $i++
}
Write-Host ""

$choice = Read-Host "   Enter number"
$chosen = [int]$choice

if (-not $map.ContainsKey($chosen)) {
    Write-Host "❌ Invalid choice." -ForegroundColor Red
    exit 1
}

$selectedPath = $map[$chosen]
$selectedName = (Split-Path $selectedPath -Leaf)

# ════════════════════════════════════════════════════════════
# STEP B — BACKUP CURRENT CREDENTIALS
# ════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "🔒 Backing up current credentials..." -ForegroundColor Yellow

$backupName = "backup_$(Get-Date -Format 'HHmmss')"
$backupPath = "$AccountsDir\_$backupName"
New-Item -ItemType Directory -Path $backupPath | Out-Null
Copy-Item "$ClaudeDir\settings.json"       "$backupPath\" -ErrorAction SilentlyContinue
Copy-Item "$ClaudeDir\settings.local.json" "$backupPath\" -ErrorAction SilentlyContinue
Write-Host "   ✅ Backed up to: $backupPath" -ForegroundColor DarkGray

# ════════════════════════════════════════════════════════════
# STEP C — SWAP CREDENTIALS
# ════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "🔑 Swapping credentials to '$selectedName'..." -ForegroundColor Yellow

try {
    Copy-Item "$selectedPath\settings.json"       "$ClaudeDir\settings.json"       -Force
    Copy-Item "$selectedPath\settings.local.json" "$ClaudeDir\settings.local.json" -Force
    Write-Host "   ✅ Credentials swapped!" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to swap: $_" -ForegroundColor Red
    exit 1
}

# ════════════════════════════════════════════════════════════
# STEP D — LOAD CHECKPOINT
# ════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "📂 Loading checkpoint..." -ForegroundColor Yellow

if (-not (Test-Path $LatestFile)) {
    Write-Host "   ⚠️  No checkpoint found. Launching Claude fresh..." -ForegroundColor Yellow
    Write-Host ""
    claude
    exit
}

$cp = Get-Content $LatestFile -Raw | ConvertFrom-Json

Write-Host "   ✅ Checkpoint: $($cp.saved_at)" -ForegroundColor Green
Write-Host ""
Write-Host "   📌 Task     : $($cp.task)" -ForegroundColor White
Write-Host "   ⚙️  Now at  : $($cp.current_step)" -ForegroundColor Yellow
Write-Host "   ✅ Done     : $($cp.completed_steps.Count) step(s)" -ForegroundColor DarkGreen
Write-Host "   ➡️  Pending : $($cp.next_steps.Count) step(s)" -ForegroundColor Cyan

# ════════════════════════════════════════════════════════════
# STEP E — BUILD RESUME PROMPT
# ════════════════════════════════════════════════════════════
$doneList  = ($cp.completed_steps | ForEach-Object { "  - $_" }) -join "`n"
$todoList  = ($cp.next_steps      | ForEach-Object { "  - $_" }) -join "`n"
$filesList = ($cp.files_created   | ForEach-Object { "  - $_" }) -join "`n"

$prompt = @"
You are resuming work from a previous Claude session that ran out of credits.
Continue EXACTLY from where it stopped. Do NOT ask for clarification. Just resume.

══════════════════════════════════════════
OVERALL TASK:
$($cp.task)

ALREADY COMPLETED (do NOT redo these):
$doneList

CURRENTLY IN PROGRESS (resume from here):
$($cp.current_step)

NEXT STEPS (do these in order after current):
$todoList

FILES ALREADY CREATED:
$filesList

KEY DECISIONS & CONTEXT:
$($cp.key_decisions)

ERRORS TO AVOID:
$($cp.errors_seen)

LAST CODE/COMMAND WORKED ON:
$($cp.last_code)

EXTRA NOTES:
$($cp.extra_notes)
══════════════════════════════════════════

Start immediately from CURRENTLY IN PROGRESS. Do not summarize. Just continue.
"@

# ════════════════════════════════════════════════════════════
# STEP F — LAUNCH CLAUDE
# ════════════════════════════════════════════════════════════
Write-Host ""
Write-Host "🚀 Launching Claude with full context..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

$prompt | claude
