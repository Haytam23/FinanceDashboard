@echo off
echo Installing Python dependencies...
cd python_backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing base dependencies...
pip install -r requirements.txt

echo Installing API server dependencies...
pip install -r requirements-api.txt

echo.
echo ============================================
echo Installation complete!
echo ============================================
echo.
echo To start the API server, run:
echo   cd python_backend
echo   venv\Scripts\activate.bat
echo   python api_server.py
echo.
pause
