param (
[int]$x,
[int]$y
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

[System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($x, $y)
Start-Sleep -Milliseconds 100

Add-Type @"
using System;
using System.Runtime.InteropServices;

public class MouseSimulator {
[DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, int dwExtraInfo);


public const int MOUSEEVENTF_LEFTDOWN = 0x02;
public const int MOUSEEVENTF_LEFTUP = 0x04;

public static void ClickAt(int x, int y) {
    mouse_event(MOUSEEVENTF_LEFTDOWN, x, y, 0, 0);
    mouse_event(MOUSEEVENTF_LEFTUP, x, y, 0, 0);
}
}
"@

[MouseSimulator]::ClickAt($x, $y)