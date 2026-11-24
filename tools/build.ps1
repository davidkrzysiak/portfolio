<#
  Builds projects-data.js from the folders in projects\.
  Run it by double-clicking "Update Site.bat" in the portfolio folder.

  For every folder in projects\ (folders starting with _ are skipped):
    - reads project.md (title, date, tools... plus the write-up)
    - converts .heic phone photos to .jpg (if Windows can read HEIC)
    - shrinks big photos (full-size originals are kept in an "originals" subfolder)
    - lists the images (for the gallery) and PDFs (shown as downloadable documents)
  Only files directly inside the project folder are used. Anything in subfolders
  (originals\, source\, ...) is ignored by the website.
#>
$ErrorActionPreference = 'Stop'
$root    = Split-Path $PSScriptRoot -Parent
$projDir = Join-Path $root 'projects'
$outFile = Join-Path $root 'projects-data.js'
$imgExt  = @('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg')
$docExt  = @('.pdf')
$utf8    = New-Object System.Text.UTF8Encoding($false)

function Test-Yes($v, $default) {
  if ($null -eq $v -or $v -eq '') { return $default }
  return @('yes', 'true', 'y', '1', 'on') -contains $v.ToString().ToLower()
}

function Convert-Heic($file) {
  try {
    Add-Type -AssemblyName PresentationCore, WindowsBase -ErrorAction Stop
    $in = [IO.File]::OpenRead($file.FullName)
    try {
      $dec = [System.Windows.Media.Imaging.BitmapDecoder]::Create($in, 'None', 'OnLoad')
      $enc = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
      $enc.QualityLevel = 88
      $enc.Frames.Add($dec.Frames[0])
      $outPath = [IO.Path]::ChangeExtension($file.FullName, '.jpg')
      $out = [IO.File]::Create($outPath); $enc.Save($out); $out.Close()
    } finally { $in.Close() }
    $orig = Join-Path $file.DirectoryName 'originals'
    New-Item -ItemType Directory -Force $orig | Out-Null
    Move-Item $file.FullName (Join-Path $orig $file.Name) -Force
    return $true
  } catch { return $false }
}

$projects = New-Object System.Collections.ArrayList
$notes    = New-Object System.Collections.ArrayList

foreach ($dir in Get-ChildItem $projDir -Directory | Where-Object { $_.Name -notmatch '^[_.]' } | Sort-Object Name) {
  $id = $dir.Name
  $md = Join-Path $dir.FullName 'project.md'
  if (-not (Test-Path $md)) { [void]$notes.Add("SKIPPED  $id  (no project.md yet; ask Claude to write it, or copy projects\_template\project.md)"); continue }

  # HEIC -> JPG, then shrink large photos
  foreach ($h in Get-ChildItem $dir.FullName -File -Filter *.heic) {
    if (Convert-Heic $h) { [void]$notes.Add("converted  $id\$($h.Name) -> .jpg") }
    else { [void]$notes.Add("WARNING  $id\$($h.Name): couldn't convert HEIC. Install 'HEIF Image Extensions' from the Microsoft Store, or export as JPG.") }
  }
  & (Join-Path $PSScriptRoot 'resize-images.ps1') -Folder $dir.FullName | Where-Object { $_ -like 'resized*' } | ForEach-Object { [void]$notes.Add("$_  ($id)") }

  # Parse front matter + body
  $text = [IO.File]::ReadAllText($md, [Text.Encoding]::UTF8) -replace "`r`n", "`n"
  $text = $text.TrimStart([char]0xFEFF)
  $meta = @{}; $body = $text
  if ($text -match '^\s*---\s*\n([\s\S]*?)\n---\s*(\n[\s\S]*)?$') {
    $fm = $Matches[1]; $body = if ($Matches[2]) { $Matches[2] } else { '' }
    foreach ($line in $fm -split "`n") {
      if ($line -match '^\s*([A-Za-z][\w-]*)\s*:\s*(.*?)\s*$') { $meta[$Matches[1].ToLower()] = $Matches[2] }
    }
  } else {
    [void]$notes.Add("WARNING  $id\project.md has no --- header block at the top; using defaults.")
  }

  $files  = Get-ChildItem $dir.FullName -File
  $images = @($files | Where-Object { $imgExt -contains $_.Extension.ToLower() } | Sort-Object Name | ForEach-Object { $_.Name })
  $docs   = @($files | Where-Object { $docExt -contains $_.Extension.ToLower() } | Sort-Object Name | ForEach-Object {
              [ordered]@{ name = $_.Name; label = [IO.Path]::GetFileNameWithoutExtension($_.Name) -replace '[_]+', ' ' } })

  $cover = $meta['cover']
  if (-not $cover -and $images.Count -gt 0) { $cover = $images[0] }
  if ($cover -and -not ($images -contains $cover) -and $cover -notmatch '^https?:') {
    [void]$notes.Add("WARNING  $id\project.md: cover '$cover' not found in the folder.")
  }

  $order = 999
  if ($meta['order'] -match '^\d+$') { $order = [int]$meta['order'] }
  $tools = @()
  if ($meta['tools']) { $tools = @($meta['tools'] -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ }) }

  [void]$projects.Add([ordered]@{
    id       = $id
    title    = if ($meta['title']) { $meta['title'] } else { $id }
    date     = [string]$meta['date']
    role     = [string]$meta['role']
    tools    = $tools
    summary  = [string]$meta['summary']
    cover    = [string]$cover
    featured = (Test-Yes $meta['featured'] $false)
    show     = (Test-Yes $meta['show'] $true)
    gallery  = (Test-Yes $meta['gallery'] $true)
    order    = $order
    images   = $images
    files    = $docs
    body     = $body.Trim()
  })
}

$sorted = @($projects | Sort-Object @{ e = { $_.order } }, @{ e = { $_.title } })
$json = if ($sorted.Count -eq 0) { '[]' } else { ConvertTo-Json -InputObject $sorted -Depth 6 }
$js = "// AUTO-GENERATED by 'Update Site.bat'. Don't edit this file; edit projects\<name>\project.md instead.`n" +
      "// Last built: $(Get-Date -Format 'yyyy-MM-dd HH:mm')`n" +
      "const PROJECTS = $json;`n"
[IO.File]::WriteAllText($outFile, $js, $utf8)

''
"Built $($sorted.Count) project(s):"
foreach ($p in $sorted) { "  {0,-3} {1}{2}" -f $p.order, $p.title, $(if (-not $p.show) { '   (hidden)' } else { '' }) }
if ($notes.Count) { ''; $notes | ForEach-Object { "  $_" } }
''
"Done. Refresh index.html in your browser."
