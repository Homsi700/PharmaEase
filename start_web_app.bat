@echo off
echo Starting PharmaEase Web App...
echo.
echo The application will be available at http://localhost:9002 once the Next.js server starts.
echo Please wait for the development server to build and start...
echo A browser window will open automatically.
echo.
start "" http://localhost:9002
npm run dev
pause