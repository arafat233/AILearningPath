# ============================================================
# STEP 2 — Save-Checkpoint.ps1
# Run this when your credits are about to run out.
# It saves everything Claude needs to continue on next account.
# ============================================================

$CheckpointDir = "E:\AiLearningPath\ClaudeTools\checkpoints"
$SessionName   = "default"

if (-not (Test-Path $CheckpointDir)) {
    New-Item -ItemType Directory -Path $CheckpointDir | Out-Null
}

$timestamp      = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$checkpointFile = "$CheckpointDir\checkpoint_${timestamp}.json"
$latestFile     = "$CheckpointDir\LATEST.json"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          SAVE CHECKPOINT BEFORE SWITCHING        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Answer these questions so Claude can resume perfectly." -ForegroundColor Gray
Write-Host ""

# ── Q1: Task ──────────────────────────────────────────────────
$task = Read-Host "  [1] Overall task / goal"
Write-Host ""

# ── Q2: Completed steps ───────────────────────────────────────
Write-Host "  [2] Steps COMPLETED so far (Enter twice when done):"
$completedSteps = @()
while ($true) {
    $s = Read-Host "      ✅ Step"
    if ([string]::IsNullOrWhiteSpace($s)) { break }
    $completedSteps += $s
}
Write-Host ""

# ── Q3: Current step ──────────────────────────────────────────
$currentStep = Read-Host "  [3] What Claude is doing RIGHT NOW (mid-task)"
Write-Host ""

# ── Q4: Next steps ────────────────────────────────────────────
Write-Host "  [4] NEXT steps to do (Enter twice when done):"
$nextSteps = @()
while ($true) {
    $s = Read-Host "      ➡️  Step"
    if ([string]::IsNullOrWhiteSpace($s)) { break }
    $nextSteps += $s
}
Write-Host ""

# ── Q5: Files created ─────────────────────────────────────────
Write-Host "  [5] Files/folders already created (Enter twice when done):"
$files = @()
while ($true) {
    $f = Read-Host "      📄 File"
    if ([string]::IsNullOrWhiteSpace($f)) { break }
    $files += $f
}
Write-Host ""

# ── Q6: Key decisions ─────────────────────────────────────────
$decisions = Read-Host "  [6] Key decisions / important context Claude must know"
Write-Host ""

# ── Q7: Errors seen ───────────────────────────────────────────
$errors = Read-Host "  [7] Errors encountered (or leave blank)"
Write-Host ""

# ── Q8: Last code ─────────────────────────────────────────────
$lastCode = Read-Host "  [8] Last code/command Claude was working on (or blank)"
Write-Host ""

# ── Q9: Extra notes ───────────────────────────────────────────
$notes = Read-Host "  [9] Anything else the next Claude should know"

# ── Build & save JSON ─────────────────────────────────────────
$checkpoint = [ordered]@{
    saved_at        = $timestamp
    task            = $task
    completed_steps = $completedSteps
    current_step    = $currentStep
    next_steps      = $nextSteps
    files_created   = $files
    key_decisions   = $decisions
    errors_seen     = $errors
    last_code       = $lastCode
    extra_notes     = $notes
}

$json = $checkpoint | ConvertTo-Json -Depth 10
$json | Out-File $checkpointFile -Encoding UTF8
$json | Out-File $latestFile     -Encoding UTF8

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "✅ Checkpoint saved!" -ForegroundColor Green
Write-Host "   → $checkpointFile" -ForegroundColor Gray
Write-Host ""
Write-Host "👉 Now run:  .\Switch-And-Resume.ps1" -ForegroundColor Yellow
Write-Host ""
