@echo off
echo Starting Casablanca Stock Exchange API Server...
cd python_backend

if not exist "venv" (
    echo Error: Virtual environment not found!
    echo Please run install_python.bat first
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
python api_server.py
