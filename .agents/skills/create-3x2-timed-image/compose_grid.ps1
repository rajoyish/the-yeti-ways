<#
.SYNOPSIS
Compose each video's 3x2 grid from its six saved panel images.

.DESCRIPTION
Reads prompts/<slug>-<30s|60s>-3x2.md. For each '## Video N - <Title>' it takes the six
'### Panel P · <timecode> · <Framing>, <Angle> · <TITLE>' headings and their 'Image:' lines,
loads those six panel image files, and writes a 1920x1080 JPEG to the path the video's
'Grid image:' line names. Each cell holds the panel image scaled to fit without cropping,
under a black strip with '<P> · <timecode> · <TITLE>'. Nothing is redrawn, so the grid shows
exactly the panel images. A video with a missing panel image is skipped and the script exits 1.

Split layout: when a video has a 'Grid images:' line instead (two paths, the first for panels 1, 2,
and 3 and the second for panels 4, 5, and 6), it writes two vertical 1080x1920 sheets, each holding
its three panel images stacked full-width one above another and read top to bottom: panels 627, 628,
and 627 pixels tall, two 19-pixel white gutters between them, no labels, and no outer border, each
panel image filling its cell edge to edge (scaled to cover, centre-cropped). Widescreen 16:9 films use it.

.EXAMPLE
pwsh -File .agents/skills/create-3x2-timed-image/compose_grid.ps1 -File prompts/babu-yeti-wolf-path-rescue-30s-3x2.md
pwsh -File .agents/skills/create-3x2-timed-image/compose_grid.ps1 -File prompts/babu-yeti-wolf-path-rescue-30s-3x2.md -Video 2
#>
param(
    [Parameter(Mandatory = $true)][string]$File,
    [int]$Video = 0,
    # Where the image paths in the file are relative to. Defaults to the repository root.
    [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# Layout. Change it here and nowhere else; SKILL.md describes it.
$GridW = 1920; $GridH = 1080; $Cols = 3; $Rows = 2
$SplitW = 1080; $SplitH = 1920   # split layout: two vertical sheets, three panels stacked on each
$SplitGap = 19                    # split layout: white gutter between stacked panels; no labels, no outer border
$Strip = 40          # label strip height at the top of each cell
$Border = 6          # black border around each picture
$FontSize = 15       # label size in pixels
$Quality = 92        # JPEG quality

$text = (Get-Content -Raw -Encoding UTF8 $File) -replace "`r`n", "`n"
$aspect = if ($text -match 'Create image: Vertical 9:16') { 9.0 / 16.0 } elseif ($text -match 'Create image: Horizontal 16:9') { 16.0 / 9.0 } else { 0 }

$sections = [regex]::Split($text, '(?m)^(?=## )') | Where-Object { $_ -match '^## Video (\d+) - ' }
if (-not $sections) { Write-Error "No '## Video N - <Title>' headings in $File"; exit 1 }

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)

# Split layout: three panels stacked full-width on a $W x $H white sheet, separated by $Gap-pixel
# white gutters, with no labels and no outer border. Panel heights share the leftover height
# (627, 628, 627 on 1080x1920). Each panel image fills its cell edge to edge, scaled to cover and
# centre-cropped, so no black bars appear.
function Save-StackedSheet($Sheet, [string]$OutPath, [int]$W, [int]$H, [int]$Gap, [int]$Num) {
    $n = $Sheet.Count
    $avail = $H - ($n - 1) * $Gap
    $canvas = New-Object System.Drawing.Bitmap $W, $H
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White)
    for ($k = 0; $k -lt $n; $k++) {
        $top = [int][math]::Round($k * $avail / $n) + $k * $Gap
        $bottom = [int][math]::Round(($k + 1) * $avail / $n) + $k * $Gap
        $ch = $bottom - $top
        $img = [System.Drawing.Image]::FromFile($Sheet[$k].Path)
        try {
            if ($aspect -gt 0) {
                $ratio = $img.Width / $img.Height
                if ([math]::Abs($ratio - $aspect) / $aspect -gt 0.03) {
                    Write-Warning ("Video ${Num}: panel $($Sheet[$k].Number) is {0}x{1}, not the film's aspect ratio" -f $img.Width, $img.Height)
                }
            }
            $scale = [math]::Max($W / $img.Width, $ch / $img.Height)
            $sw = $W / $scale; $sh = $ch / $scale
            $src = New-Object System.Drawing.RectangleF (($img.Width - $sw) / 2), (($img.Height - $sh) / 2), $sw, $sh
            $dst = New-Object System.Drawing.Rectangle 0, $top, $W, $ch
            $g.DrawImage($img, $dst, $src, [System.Drawing.GraphicsUnit]::Pixel)
        } finally { $img.Dispose() }
    }
    $dir = Split-Path -Parent $OutPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $canvas.Save($OutPath, $codec, $encParams)
    $g.Dispose(); $canvas.Dispose()
}

# Draws the given panels into one sheet of $W x $H, $C columns by $R rows, in reading order
# (left to right, then top to bottom), each under its label strip, and saves it as a JPEG.
function Save-Sheet($Sheet, [string]$OutPath, [int]$W, [int]$H, [int]$C, [int]$R, [int]$Num) {
    $cw = [int]($W / $C); $ch = [int]($H / $R)
    $canvas = New-Object System.Drawing.Bitmap $W, $H
    $g = [System.Drawing.Graphics]::FromImage($canvas)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::Black)
    $font = New-Object System.Drawing.Font 'Segoe UI Semibold', $FontSize, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $white = [System.Drawing.Brushes]::White
    $fmt = New-Object System.Drawing.StringFormat
    $fmt.Alignment = [System.Drawing.StringAlignment]::Center
    $fmt.LineAlignment = [System.Drawing.StringAlignment]::Center
    $fmt.Trimming = [System.Drawing.StringTrimming]::EllipsisCharacter
    $fmt.FormatFlags = [System.Drawing.StringFormatFlags]::NoWrap
    $k = 0
    foreach ($p in $Sheet) {
        $col = $k % $C; $row = [math]::Floor($k / $C); $k++
        $x = $col * $cw; $y = $row * $ch
        $label = "$($p.Number) · $($p.Timecode) · $($p.Title)"
        $g.DrawString($label, $font, $white, (New-Object System.Drawing.RectangleF ($x + $Border), $y, ($cw - 2 * $Border), $Strip), $fmt)
        $img = [System.Drawing.Image]::FromFile($p.Path)
        try {
            if ($aspect -gt 0) {
                $ratio = $img.Width / $img.Height
                if ([math]::Abs($ratio - $aspect) / $aspect -gt 0.03) {
                    Write-Warning ("Video ${Num}: panel $($p.Number) is {0}x{1}, not the film's aspect ratio" -f $img.Width, $img.Height)
                }
            }
            $boxW = $cw - 2 * $Border; $boxH = $ch - $Strip - $Border
            $scale = [math]::Min($boxW / $img.Width, $boxH / $img.Height)
            $dw = [int]($img.Width * $scale); $dh = [int]($img.Height * $scale)
            $dx = $x + $Border + [int](($boxW - $dw) / 2); $dy = $y + $Strip + [int](($boxH - $dh) / 2)
            $g.DrawImage($img, $dx, $dy, $dw, $dh)
        } finally { $img.Dispose() }
    }
    $dir = Split-Path -Parent $OutPath
    if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $canvas.Save($OutPath, $codec, $encParams)
    $g.Dispose(); $canvas.Dispose(); $font.Dispose()
}

$failed = $false
foreach ($section in $sections) {
    $num = [int]([regex]::Match($section, '^## Video (\d+) - ').Groups[1].Value)
    if ($Video -and $num -ne $Video) { continue }

    $split = [regex]::Match($section, '(?m)^Grid images: `([^`]+)`[^`]*`([^`]+)`')
    $gridMatch = [regex]::Match($section, '(?m)^Grid image: `([^`]+)`')
    if (-not $split.Success -and -not $gridMatch.Success) { Write-Warning "Video ${num}: no 'Grid image:' or 'Grid images:' line; skipped."; $failed = $true; continue }

    $heads = [regex]::Matches($section, '(?m)^### Panel (\d) · (\S+) · ([^·]+?) · (.+?)[ \t]*$')
    if ($heads.Count -ne 6) { Write-Warning "Video ${num}: $($heads.Count) panel headings, expected 6; skipped."; $failed = $true; continue }

    $panels = @()
    for ($i = 0; $i -lt 6; $i++) {
        $head = $heads[$i]
        $end = if ($i -lt 5) { $heads[$i + 1].Index } else { $section.Length }
        $part = $section.Substring($head.Index, $end - $head.Index)
        $imgLine = [regex]::Match($part, '(?m)^Image: `([^`]+)`')
        $path = if ($imgLine.Success) { Join-Path $Root $imgLine.Groups[1].Value } else { $null }
        $panels += [pscustomobject]@{
            Number = [int]$head.Groups[1].Value; Timecode = $head.Groups[2].Value
            Title = $head.Groups[4].Value.Trim().ToUpperInvariant(); Path = $path
        }
    }
    $missing = $panels | Where-Object { -not $_.Path -or -not (Test-Path -LiteralPath $_.Path) }
    if ($missing) {
        foreach ($m in $missing) { Write-Warning "Video ${num}: panel $($m.Number) image not found: $($m.Path)" }
        Write-Warning "Video ${num}: grid not composed; generate and save all six panel images first."
        $failed = $true; continue
    }

    if ($split.Success) {
        $sheets = @(
            @{ Path = $split.Groups[1].Value; Panels = @($panels | Where-Object { $_.Number -le 3 }) },
            @{ Path = $split.Groups[2].Value; Panels = @($panels | Where-Object { $_.Number -ge 4 }) }
        )
        foreach ($s in $sheets) {
            Save-StackedSheet $s.Panels (Join-Path $Root $s.Path) $SplitW $SplitH $SplitGap $num
            Write-Output "Video ${num}: composed $($s.Path) from panels $(($s.Panels | ForEach-Object { $_.Number }) -join ', '), top to bottom"
        }
    } else {
        Save-Sheet $panels (Join-Path $Root $gridMatch.Groups[1].Value) $GridW $GridH $Cols $Rows $num
        Write-Output "Video ${num}: composed $($gridMatch.Groups[1].Value) from Panel_1_V$num to Panel_6_V$num"
    }
}
if ($failed) { exit 1 }
