chcp 65001 >nul
@echo off
set GITHUB_USER=HMX0528
cd /d "%~dp0"

echo ================================
echo  Deploy: Love Diary
echo ================================
echo  GitHub: %GITHUB_USER%
echo ================================
echo.

git --version >nul 2>&1
if %errorlevel% NEQ 0 (
  echo Installing Git...
  winget install --id Git.Git -e --source winget
) else (
  echo Git already installed, skipping...
)

echo.
echo [2/3] Creating local repo...
git init 2>nul
git config user.name "%GITHUB_USER%"
git config user.email "3474854757@qq.com"
git add -A
git commit -m "init"
git branch -M main
echo.
echo Repo ready.
echo.
echo Now create a GitHub repo:
echo 1. Open https://github.com/new
echo 2. Repo name: love-diary
echo 3. Public
echo 4. Click Create
echo 5. Then press Enter to push...
pause >nul

git remote add origin https://github.com/%GITHUB_USER%/love-diary.git
echo Pushing code to GitHub (login if prompted)...
git push -u origin main
echo.
echo Done! Code is on GitHub.
echo.
echo Next: Deploy to Railway
echo 1. Open https://railway.app/login
echo 2. Login with GitHub
echo 3. New Project - Deploy from GitHub repo
echo 4. Select love-diary
echo 5. Settings - Public Networking - Generate Domain
echo 6. Share the URL with your girlfriend
echo.
pause
