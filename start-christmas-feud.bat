@echo off
title CHRISTMAS FEUD - The Ultimate Christmas Game Show
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel%==0 (
  set NODE_EXE=node
) else if exist "%LOCALAPPDATA%\Programs\node-portable\node.exe" (
  set NODE_EXE=%LOCALAPPDATA%\Programs\node-portable\node.exe
) else (
  echo Node.js 18+ is required. Download from https://nodejs.org
  pause
  exit /b 1
)

echo.
echo ============================================================
echo   CHRISTMAS FEUD - THE ULTIMATE CHRISTMAS GAME SHOW
echo   Starting Live Multiplayer Server on http://localhost:3000
echo ============================================================
echo.
"%NODE_EXE%" server\server.js
pause
