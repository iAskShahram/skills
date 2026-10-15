# Save a screenshot of the Windows desktop to a PNG.
# Usage: save-screenshot.ps1 -Out C:\tmp\shot.png [-Region left,top,right,bottom]
# Region uses virtual-desktop pixels (same as Windows-MCP Screenshot's `region`). Omit for all monitors.
param(
    [Parameter(Mandatory)][string]$Out,
    [string]$Region  # "left,top,right,bottom"
)
$ErrorActionPreference = 'Stop'

Add-Type -Name Dpi -Namespace WinMcpShot -MemberDefinition '[DllImport("user32.dll")] public static extern bool SetProcessDPIAware();'
[void][WinMcpShot.Dpi]::SetProcessDPIAware()
Add-Type -AssemblyName System.Drawing, System.Windows.Forms

if ($Region) {
    $parts = $Region -split '[,\s]+' | Where-Object { $_ }
    if ($parts.Count -ne 4) { throw 'Region must be 4 integers: left,top,right,bottom' }
    $l, $t, $r, $b = $parts | ForEach-Object { [int]$_ }
    if ($r -le $l -or $b -le $t) { throw 'Region must satisfy right > left and bottom > top' }
} else {
    $v = [System.Windows.Forms.SystemInformation]::VirtualScreen
    $l, $t, $r, $b = $v.Left, $v.Top, $v.Right, $v.Bottom
}

$Out = [System.IO.Path]::GetFullPath($Out)
[void][System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($Out))

$bmp = New-Object System.Drawing.Bitmap ($r - $l), ($b - $t)
$g = [System.Drawing.Graphics]::FromImage($bmp)
try {
    $g.CopyFromScreen($l, $t, 0, 0, $bmp.Size)
    $bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $g.Dispose(); $bmp.Dispose()
}
"$Out ($($r - $l)x$($b - $t))"
