@echo off
title Subiendo AmiiboVault a GitHub...
cd /d "%~dp0"
echo ========================================================
echo   Subiendo AmiiboVault a GitHub...
echo   Repositorio: https://github.com/yiveldeabreu0709-netizen/amiibolik_vaults.git
echo ========================================================
echo.
"%LOCALAPPDATA%\Programs\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   EXITO: Tu proyecto se ha subido correctamente a GitHub!
    echo ========================================================
) else (
    echo ========================================================
    echo   Hubo un detalle al subir. Revisa los mensajes arriba.
    echo ========================================================
)
echo.
pause
