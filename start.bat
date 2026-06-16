@echo off
title 甜蜜记忆 - www.hmxlovely.com
cd /d "%~dp0"
set PATH=C:\Users\hmx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
start "" "http://www.hmxlovely.com:3000"
C:\Users\hmx\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe server.js
pause