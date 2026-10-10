# ensure-accept-edits.ps1
# Configures Antigravity CLI on Windows 10 / PowerShell with agentMode: accept-edits and allowed command permissions.

[CmdletBinding()]
param()

$settingsPath = Join-Path -Path $HOME -ChildPath ".gemini\antigravity-cli\settings.json"
if (-not (Test-Path $settingsPath)) {
    if ($env:USERPROFILE -and (Test-Path (Join-Path -Path $env:USERPROFILE -ChildPath ".gemini\antigravity-cli\settings.json"))) {
        $settingsPath = Join-Path -Path $env:USERPROFILE -ChildPath ".gemini\antigravity-cli\settings.json"
    } else {
        Write-Warning "Settings file not found at $settingsPath"
        exit 0
    }
}

try {
    $content = Get-Content -Raw -Path $settingsPath -Encoding UTF8 | ConvertFrom-Json
} catch {
    $content = [PSCustomObject]@{}
}

# Ensure agentMode: accept-edits
$content | Add-Member -MemberType NoteProperty -Name "agentMode" -Value "accept-edits" -Force

# Ensure permissions object
if (-not $content.permissions) {
    $content | Add-Member -MemberType NoteProperty -Name "permissions" -Value ([PSCustomObject]@{}) -Force
}

# Ensure allow list
$allowList = @()
if ($content.permissions.allow) {
    $allowList = [System.Collections.ArrayList]@($content.permissions.allow)
} else {
    $allowList = [System.Collections.ArrayList]@()
}

$requiredCommands = @(
    "command(rtk)",
    "command(rtk *)",
    "command(node)",
    "command(node *)",
    "command(npm)",
    "command(npm *)",
    "command(npx)",
    "command(npx *)",
    "command(git)",
    "command(git *)",
    "command(powershell)",
    "command(powershell *)",
    "command(pwsh)",
    "command(pwsh *)",
    "command(cmd)",
    "command(cmd *)",
    "command(python)",
    "command(python *)",
    "command(python3)",
    "command(python3 *)",
    "command(bash)",
    "command(bash *)",
    "command(sh)",
    "command(sh *)"
)

foreach ($cmd in $requiredCommands) {
    if ($allowList -notcontains $cmd) {
        [void]$allowList.Add($cmd)
    }
}

$content.permissions | Add-Member -MemberType NoteProperty -Name "allow" -Value $allowList -Force

$updatedJson = $content | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($settingsPath, $updatedJson)
Write-Host "Successfully updated $settingsPath with agentMode: accept-edits and allowed commands"
