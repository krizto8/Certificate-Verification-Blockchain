@echo off
echo ========================================
echo   Blockchain Certificate Verification
echo   Quick Setup Script for Windows
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

echo [2/5] Installing dependencies...
echo This may take 3-5 minutes...
echo.

echo Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Root installation failed
    pause
    exit /b 1
)

echo Installing contract dependencies...
cd contracts
call npm install
if errorlevel 1 (
    echo ERROR: Contract installation failed
    pause
    exit /b 1
)
cd ..

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..

echo.
echo ✓ All dependencies installed successfully!
echo.

echo [3/5] Creating environment file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created from template
    echo.
    echo IMPORTANT: Please edit .env file with your configuration
    echo - Add Infura API key for Sepolia
    echo - Add Pinata keys for IPFS
    echo - Set admin credentials
    echo.
) else (
    echo .env file already exists, skipping...
)

echo [4/5] Compiling smart contracts...
cd contracts
call npx hardhat compile
if errorlevel 1 (
    echo ERROR: Contract compilation failed
    pause
    exit /b 1
)
cd ..
echo ✓ Contracts compiled successfully
echo.

echo [5/5] Running tests...
cd contracts
call npx hardhat test
if errorlevel 1 (
    echo WARNING: Some tests failed
) else (
    echo ✓ All tests passed
)
cd ..
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Edit .env file with your configuration
echo 2. Start local blockchain:
echo    cd contracts
echo    npx hardhat node
echo.
echo 3. In a new terminal, deploy contract:
echo    cd contracts
echo    npx hardhat run scripts\deploy.js --network localhost
echo.
echo 4. Update .env with contract address
echo.
echo 5. Start backend (new terminal):
echo    cd backend
echo    npm run dev
echo.
echo 6. Start frontend (new terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 7. Open browser: http://localhost:3000
echo.
echo For detailed instructions, see:
echo - README.md
echo - docs\QUICKSTART.md
echo.
echo ========================================

pause
