@echo off
title Commit de AmiiboVault
cd /d "%~dp0"
set GIT="%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
echo ========================================================
echo   Haciendo commit de los cambios de AmiiboVault
echo ========================================================
echo.
%GIT% add index.html vault-fx.js hyperframes/presentacion-portal
%GIT% commit -m "Arregla banner con GIF, agrega sonidos y animaciones, y video de presentacion" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_01YC8ohPLCzwAa3QhMw3CA9A"
echo.
if %ERRORLEVEL% equ 0 (
    echo Commit hecho. Ahora puedes abrir SUBIR_A_GITHUB.bat para subirlo.
) else (
    echo Hubo un detalle. Revisa los mensajes arriba.
)
echo.
pause
