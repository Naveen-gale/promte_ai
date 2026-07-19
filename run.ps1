# Start the backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\.venv\Scripts\python.exe backend\app.py"

# Start the frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
