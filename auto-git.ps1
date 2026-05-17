$repoPath = "C:\Users\AGYIRI SAKYI\Desktop\VDCMF"
$logFile = "$repoPath\auto-git.log"

Set-Location -LiteralPath $repoPath

$status = git status --porcelain

if (-not $status) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - No changes to commit" | Add-Content -Path $logFile
    exit 0
}

git add -A

$message = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
git commit -m $message

$pushResult = git push 2>&1

if ($LASTEXITCODE -eq 0) {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Committed and pushed $($status.Count) file(s)" | Add-Content -Path $logFile
} else {
    "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') - Push failed: $pushResult" | Add-Content -Path $logFile
}
