# Registra el comando "factucore" en el perfil de PowerShell (una sola vez por PC).
# Uso: pwsh -File scripts\install-factucore-command.ps1

$marker = "# >>> factucore dev command >>>"
$endMarker = "# <<< factucore dev command <<<"

$block = @"
$marker
function factucore {
    `$root = Get-Location
    while (`$root -and -not (Test-Path (Join-Path `$root 'factucore.cmd'))) {
        `$parent = Split-Path `$root -Parent
        if (-not `$parent -or `$parent -eq `$root) { `$root = `$null; break }
        `$root = `$parent
    }
    if (-not `$root) {
        Write-Error "No se encontro factucore.cmd. Ejecuta este comando dentro de un proyecto que lo tenga (ej. facturacion-cliente)."
        return
    }
    Push-Location `$root
    try { & .\factucore.cmd } finally { Pop-Location }
}
$endMarker
"@

if (-not (Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}

$content = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
if ($content -and $content.Contains($marker)) {
    Write-Host "El comando 'factucore' ya estaba instalado en $PROFILE"
} else {
    Add-Content -Path $PROFILE -Value "`n$block"
    Write-Host "Comando 'factucore' instalado en $PROFILE"
    Write-Host "Abri una nueva terminal de PowerShell (o corre '. `$PROFILE') para usarlo."
}
