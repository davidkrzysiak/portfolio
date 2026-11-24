<#
  Shrinks large JPG/PNG photos so the website loads fast.
  - Any image wider or taller than -MaxSize pixels is resized (aspect kept).
  - The full-size original is moved into an "originals" subfolder first, so nothing is lost.
  Usage:  powershell -ExecutionPolicy Bypass -File tools\resize-images.ps1 -Folder "projects\my-project"
#>
param(
  [Parameter(Mandatory = $true)][string]$Folder,
  [int]$MaxSize = 1800,
  [int]$Quality = 85
)
Add-Type -AssemblyName System.Drawing
$Folder = (Resolve-Path $Folder).Path
$origDir = Join-Path $Folder 'originals'
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

Get-ChildItem $Folder -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' } | ForEach-Object {
  $file = $_
  $img = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    # Respect camera rotation (EXIF orientation)
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip('Rotate180FlipNone') }
        6 { $img.RotateFlip('Rotate90FlipNone') }
        8 { $img.RotateFlip('Rotate270FlipNone') }
      }
    }
    $w = $img.Width; $h = $img.Height
    if ([Math]::Max($w, $h) -le $MaxSize -and $file.Length -lt 1.5MB) { "ok      $($file.Name) (${w}x${h})"; return }
    $scale = [Math]::Min(1.0, $MaxSize / [Math]::Max($w, $h))
    $nw = [int]($w * $scale); $nh = [int]($h * $scale)
    $bmp = New-Object System.Drawing.Bitmap $nw, $nh
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($img, 0, 0, $nw, $nh)
    $g.Dispose()
  } finally { $img.Dispose() }

  New-Item -ItemType Directory -Force $origDir | Out-Null
  $orig = Join-Path $origDir $file.Name
  if (-not (Test-Path $orig)) { Move-Item $file.FullName $orig } else { Remove-Item $file.FullName }

  if ($file.Extension -match 'png') {
    $bmp.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
  } else {
    $p = New-Object System.Drawing.Imaging.EncoderParameters 1
    $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$Quality)
    $bmp.Save($file.FullName, $jpegCodec, $p)
  }
  $bmp.Dispose()
  "resized $($file.Name)  ${w}x${h} -> ${nw}x${nh}"
}
