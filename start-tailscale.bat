@echo off
title ???? - Tailscale ???
cd /d "%~dp0"
set PATH=C:\Users\hmx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%

echo =============================================
echo  ????? + Tailscale ??
echo =============================================
echo.

:: Start server
echo [1/2] Starting server...
start /B "" node.exe server.js
timeout /t 3 /nobreak >nul

:: Check Tailscale
echo [2/2] Checking Tailscale IP...
echo.
tailscale ip -4 > tailscale-ip.txt 2>nul
if exist tailscale-ip.txt (
  set /p TS_IP=<tailscale-ip.txt
  echo =============================================
  echo  ?????????:
  echo.
  echo  http://%TS_IP%:3000
  echo.
  echo =============================================
  echo  ???????,??????????
  echo.
) else (
  echo [INFO] Tailscale ???????
  echo ????: https://tailscale.com/download
  echo.
)

pause
