@echo off
cd /d C:\Users\hp\Downloads\finance-dashboard\python_backend
python -m uvicorn api_server:app --host 127.0.0.1 --port 8000
