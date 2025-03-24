@echo off
title discord-emoji-deleter

echo "Discord Emoji Deleter - Installer & Starter"
echo =======================================
echo.

WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js: https://nodejs.org/
    echo.
    pause
    exit /b
)

IF NOT EXIST "package.json" (
    echo [ERROR] package.json file not found!
    echo Please run this BAT file in the same directory as index.js and package.json.
    echo.
    pause
    exit /b
)

echo [1/3] Installing dependencies...
call npm install
echo.

IF NOT EXIST "index.js" (
    echo [ERROR] index.js file not found!
    echo Please run this BAT file in the same directory as index.js and package.json.
    echo.
    pause
    exit /b
)

echo [2/3] Please check your bot settings:
echo - Make sure the token and server ID are correct
echo - Verify the whitelisted emojis
echo.
echo [3/3] Starting the bot...
echo You can close this window to exit.
echo.

node index.js

echo.
echo Process completed!
pause