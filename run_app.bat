@echo off
echo ===================================================
echo     PAYTM SAATHI AI - TRACK 1: MERCHANT GROWTH AI
echo   From Transactions -> Insights -> Decisions -> Actions
echo ===================================================
echo.

echo [1/2] Starting Paytm Saathi FastAPI Backend on http://127.0.0.1:8000...
start "Paytm Saathi Backend" cmd /k "python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Paytm Saathi React Frontend on http://localhost:5173...
start "Paytm Saathi Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ===================================================
echo   PAYTM SAATHI IS READY!
echo   Frontend: http://localhost:5173
echo   Backend Docs: http://127.0.0.1:8000/docs
echo ===================================================
pause
