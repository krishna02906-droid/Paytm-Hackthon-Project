@echo off
cd /d "%~dp0"
title Paytm Saathi AI - One-Click Launcher

echo ===================================================
echo     PAYTM SAATHI AI - TRACK 1: MERCHANT GROWTH AI
echo   From Transactions -^> Insights -^> Decisions -^> Actions
echo ===================================================
echo.

echo [1/3] Starting Paytm Saathi FastAPI Backend on http://127.0.0.1:8000...
start "Paytm Saathi Backend" cmd /k "cd /d "%~dp0" && call backend\venv\Scripts\activate.bat && set PYTHONPATH=. && python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Paytm Saathi React Frontend on http://localhost:5173...
start "Paytm Saathi Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Launching Paytm Saathi Dashboard in browser...
start http://localhost:5173

echo.
echo ===================================================
echo   PAYTM SAATHI IS READY FOR JUDGING DEMO!
echo.
echo   - Frontend:     http://localhost:5173
echo   - Backend Docs: http://127.0.0.1:8000/docs
echo   - Health Check: http://127.0.0.1:8000/api/health
echo ===================================================
echo.
pause
