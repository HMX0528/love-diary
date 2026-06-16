@echo off
title 甜蜜记忆 - 管理员设置
cd /d "%~dp0"

echo.
echo 正在配置 hosts 文件...
echo 127.0.0.1 www.hmxlovely.com >> C:\WINDOWS\System32\drivers\etc\hosts
echo 127.0.0.1 hmxlovely.com >> C:\WINDOWS\System32\drivers\etc\hosts
echo OK

echo 正在添加防火墙规则...
netsh advfirewall firewall add rule name="Sweet-Memories-80" dir=in action=allow protocol=TCP localport=80 > nul
netsh advfirewall firewall add rule name="Sweet-Memories-3000" dir=in action=allow protocol=TCP localport=3000 > nul
echo OK

echo.
echo ====================================
echo  全部完成！
echo ====================================
echo.
echo 访问地址: http://www.hmxlovely.com:3000
echo 本机地址: http://localhost:3000
echo.
pause