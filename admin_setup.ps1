Add-Content C:\WINDOWS\System32\drivers\etc\hosts "`r`n127.0.0.1 www.hmxlovely.com"
Add-Content C:\WINDOWS\System32\drivers\etc\hosts "`r`n127.0.0.1 hmxlovely.com"
netsh advfirewall firewall add rule name="Sweet-Memories-80" dir=in action=allow protocol=TCP localport=80 > $null 2>&1
netsh advfirewall firewall add rule name="Sweet-Memories-3000" dir=in action=allow protocol=TCP localport=3000 > $null 2>&1
Write-Host "Done! hosts updated + firewall rules added"
Start-Sleep 3
