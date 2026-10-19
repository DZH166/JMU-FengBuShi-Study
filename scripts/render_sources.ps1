$ErrorActionPreference = 'Stop'
$sourceRoot = Split-Path $PSScriptRoot -Parent | Split-Path -Parent
$renderRoot = Join-Path (Split-Path $PSScriptRoot -Parent) 'evidence\renders'
New-Item -ItemType Directory -Path $renderRoot -Force | Out-Null
$ppt = New-Object -ComObject PowerPoint.Application
try {
    foreach ($f in Get-ChildItem -LiteralPath $sourceRoot -Filter '*.pptx') {
        $dest = Join-Path $renderRoot $f.BaseName
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        $pres = $ppt.Presentations.Open($f.FullName, $true, $false, $false)
        try { $pres.Export($dest, 'PNG', 1280, 720); Write-Output "$($f.BaseName): $($pres.Slides.Count) slides rendered" } finally { $pres.Close() }
    }
} finally { $ppt.Quit() }
