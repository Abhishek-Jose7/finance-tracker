# FinAI Setup Script for Windows PowerShell
# Run this script to automatically set up your development environment

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  FinAI Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
    
    # Check version
    $versionNumber = [version]($nodeVersion -replace 'v', '')
    if ($versionNumber.Major -lt 18) {
        Write-Host "✗ Node.js version 18 or higher is required!" -ForegroundColor Red
        Write-Host "  Please upgrade from: https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "  Please install from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check npm installation
Write-Host "Checking npm installation..." -ForegroundColor Yellow
if (Test-Command npm) {
    $npmVersion = npm --version
    Write-Host "✓ npm is installed: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "✗ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check if package.json exists
if (!(Test-Path "package.json")) {
    Write-Host "✗ package.json not found!" -ForegroundColor Red
    Write-Host "  Make sure you're in the project directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Installing Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Clean install
Write-Host "Cleaning previous installations..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installing npm packages (this may take a few minutes)..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Environment Configuration" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host ".env file not found. Creating from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✓ Created .env file" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠ IMPORTANT: You need to add your GEMINI_API_KEY to .env" -ForegroundColor Yellow
        Write-Host "  1. Get your API key from: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
        Write-Host "  2. Open .env file and replace 'your_gemini_api_key_here' with your actual key" -ForegroundColor Cyan
        Write-Host ""
        
        $openEnv = Read-Host "Would you like to open .env file now? (y/n)"
        if ($openEnv -eq 'y' -or $openEnv -eq 'Y') {
            notepad .env
        }
    } else {
        Write-Host "✗ .env.example not found!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
    
    # Check if API key is set
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "GEMINI_API_KEY=your_") {
        Write-Host "⚠ WARNING: GEMINI_API_KEY appears to be using the default value" -ForegroundColor Yellow
        Write-Host "  Please update it with your actual API key" -ForegroundColor Yellow
        
        $openEnv = Read-Host "Would you like to open .env file now? (y/n)"
        if ($openEnv -eq 'y' -or $openEnv -eq 'Y') {
            notepad .env
        }
    }
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Validation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Run type check
Write-Host "Running TypeScript type check..." -ForegroundColor Yellow
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ TypeScript type check passed" -ForegroundColor Green
} else {
    Write-Host "⚠ TypeScript type check failed (this may be okay for now)" -ForegroundColor Yellow
}

Write-Host ""

# Test build
Write-Host "Testing production build..." -ForegroundColor Yellow
Write-Host "(This may take a few minutes...)" -ForegroundColor Gray

npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Production build successful" -ForegroundColor Green
} else {
    Write-Host "✗ Production build failed" -ForegroundColor Red
    Write-Host "  Check the errors above or run 'npm run build' for details" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Green
Write-Host "  1. Ensure your GEMINI_API_KEY is set in .env file" -ForegroundColor White
Write-Host "  2. Run 'npm run dev' to start the development server" -ForegroundColor White
Write-Host "  3. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "Useful commands:" -ForegroundColor Green
Write-Host "  npm run dev      - Start development server" -ForegroundColor White
Write-Host "  npm run build    - Build for production" -ForegroundColor White
Write-Host "  npm run start    - Start production server" -ForegroundColor White
Write-Host "  npm run lint     - Run ESLint" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Green
Write-Host "  README.md              - Full documentation" -ForegroundColor White
Write-Host "  QUICKSTART.md          - Quick start guide" -ForegroundColor White
Write-Host "  TROUBLESHOOTING.md     - Common issues" -ForegroundColor White
Write-Host "  DEPLOYMENT.md          - Deployment guides" -ForegroundColor White
Write-Host ""

$startDev = Read-Host "Would you like to start the development server now? (y/n)"
if ($startDev -eq 'y' -or $startDev -eq 'Y') {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    npm run dev
}

Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
