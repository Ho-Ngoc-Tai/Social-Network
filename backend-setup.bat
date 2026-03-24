@echo off
echo 🎯 Setting up Social Network Backend with SurrealDB + GraphQL...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Create backend directory
echo 📁 Creating backend directory...
if not exist social-network-backend mkdir social-network-backend
cd social-network-backend

REM Initialize NestJS project if not exists
if not exist package.json (
    echo 🔧 Initializing NestJS project...
    npm i -g @nestjs/cli
    nest new . --package-manager npm --skip-git
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install @nestjs/graphql @nestjs/platform-express
npm install @nestjs/jwt @nestjs/passport @nestjs/config
npm install passport passport-jwt passport-local
npm install bcryptjs
npm install @apollo/server graphql
npm install surrealdb.js

REM Install dev dependencies
echo 🔧 Installing dev dependencies...
npm install -D @types/passport-jwt @types/passport-local
npm install -D @types/bcryptjs

REM Create environment file
echo 📝 Creating environment file...
(
echo # SurrealDB Configuration
echo SURREALDB_URL=http://localhost:8000
echo SURREALDB_NAMESPACE=social_network
echo SURREALDB_DATABASE=main
echo SURREALDB_USERNAME=root
echo SURREALDB_PASSWORD=root
echo.
echo # JWT Configuration
echo JWT_SECRET=your-super-secret-jwt-key-change-in-production-%random%
echo JWT_EXPIRES_IN=7d
echo.
echo # GraphQL Configuration
echo GRAPHQL_PLAYGROUND=true
echo GRAPHQL_DEBUG=true
echo.
echo # App Configuration
echo PORT=3001
echo NODE_ENV=development
) > .env

echo ✅ Backend setup complete!
echo.
echo 🎯 Next steps:
echo 1. Install SurrealDB from: https://surrealdb.com/install
echo 2. Start SurrealDB: surreal start --root --auth --log debug --user root --pass root memory
echo 3. cd social-network-backend
echo 4. npm run start:dev
echo 5. Open http://localhost:3001/graphql
echo.
echo 🔑 Test credentials:
echo   Email: test@example.com
echo   Password: test123
echo.
echo 🚀 Your backend will be ready at: http://localhost:3001/graphql
pause
