@echo off
title Publish Portfolio
cd /d "%~dp0"
echo Rebuilding the site...
powershell -NoProfile -ExecutionPolicy Bypass -File "tools\build.ps1"
echo.
echo Changes to publish:
git status --short
echo.
set /p MSG=Describe the change (or press Enter for "Update portfolio"):
if "%MSG%"=="" set MSG=Update portfolio
git add -A
git commit -m "%MSG%"
git push
echo.
echo Published! The live site updates in about a minute:
echo https://davidkrzysiak.github.io/portfolio/
pause
