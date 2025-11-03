<#
Simple script PowerShell para guardar el contenido del portapapeles en
`backend/chat-logs/chat_YYYY-MM-DD_HH-MM-SS.md`.

Uso:
  1. Selecciona y copia el texto del chat (Ctrl+C) en la interfaz del chat.
  2. Ejecuta este script desde la raíz del workspace o desde cualquier
     ubicación (usa la tarea de VS Code o `.\backend\save-chat.ps1`).

El script crea la carpeta si no existe y escribe el contenido en UTF-8.
#>

param(
    [string]$Folder = "$PSScriptRoot\chat-logs",
    [switch]$Commit,
    [switch]$Push
)

# Crear carpeta si no existe
if (-not (Test-Path $Folder)) {
    New-Item -ItemType Directory -Path $Folder | Out-Null
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$outFile = Join-Path $Folder ("chat_" + $timestamp + ".md")

try {
    $clip = Get-Clipboard -Raw
} catch {
    Write-Error "No hay contenido en el portapapeles o Get-Clipboard no está disponible. Copia el chat y vuelve a intentar."
    exit 1
}

# Metadata
$user = $env:USERNAME
$computer = $env:COMPUTERNAME
$cwd = (Get-Location).Path
$gitBranch = "(no git)"
try {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $gitBranchRaw = git -C $PSScriptRoot rev-parse --abbrev-ref HEAD 2>$null
        if ($LASTEXITCODE -eq 0 -and $gitBranchRaw) { $gitBranch = $gitBranchRaw.Trim() }
    }
} catch { }

$header = @()
$header += "# Chat guardado: $timestamp"
$header += ""
$header += "- Usuario: $user"
$header += "- Equipo: $computer"
$header += "- Carpeta actual: $cwd"
$header += "- Repo branch: $gitBranch"
$header += ""
$header += "---`n"

$header | Out-File -FilePath $outFile -Encoding utf8
$clip | Out-File -FilePath $outFile -Encoding utf8 -Append

Write-Host "Guardado en $outFile"

# Si se pidió commit, intentar añadir y commitear el nuevo archivo (no hace push por defecto)
if ($Commit) {
    try {
        if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
            Write-Warning "git no está disponible en PATH; no se puede commitear automáticamente."
        } else {
            Push-Location $PSScriptRoot
            git add -- "$outFile" | Out-Null
            $msg = "chore: add chat log $($timestamp)"
            git commit -m $msg --quiet
            $commitHash = git rev-parse --short HEAD 2>$null
            if ($LASTEXITCODE -eq 0) { Write-Host "Committed: $commitHash" }
            else { Write-Warning "Commit pudo no haberse creado (salida no cero)." }
            if ($Push) {
                git push
            }
            Pop-Location
        }
    } catch {
        Write-Warning "Error intentando commitear: $_"
    }
}
