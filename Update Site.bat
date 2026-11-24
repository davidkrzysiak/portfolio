@echo off
title Update Portfolio
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0tools\build.ps1"
echo.
pause
