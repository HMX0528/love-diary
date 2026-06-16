@echo off
title Sweet Memories - Online
cd /d "%~dp0"
set PATH=C:\Users\hmx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%

echo ========================================
echo   Starting Server + ngrok Tunnel
echo ========================================
echo.

:: Clean old files
del ngrok.log 2>nul
del tunnel.log 2>nul

:: Start server
echo [1/2] Starting web server...
start /B "" node.exe server.js
timeout /t 3 /nobreak >nul

:: Check if ngrok.exe exists
if not exist ngrok.exe (
  echo [ERROR] ngrok.exe not found!
  echo Download from: https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip
  echo Extract ngrok.exe to this folder and try again.
  pause
  exit /b 1
)

:: Start ngrok
echo [2/2] Starting ngrok tunnel...
start /B "" ngrok.exe http 3000 --log=ngrok.log
timeout /t 5 /nobreak >nul

:: Show URL
echo.
echo ========================================
echo   PUBLIC URL (send this to the other person):
findstr "url=" ngrok.log 2>nul
echo.
echo   Local: http://localhost:3000
echo ========================================
echo.
echo   NOTE: Keep this window open.
echo   Close it to stop sharing.
echo.
pause
