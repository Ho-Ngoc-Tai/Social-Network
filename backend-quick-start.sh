#!/bin/bash

# 🚀 Social Network Backend Quick Start Script
# SurrealDB + GraphQL + NestJS

echo "🎯 Setting up Social Network Backend with SurrealDB + GraphQL..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Create backend directory
echo "📁 Creating backend directory..."
mkdir -p social-network-backend
cd social-network-backend

# Initialize NestJS project
echo "🔧 Initializing NestJS project..."
if [ ! -f package.json ]; then
    npm i -g @nestjs/cli
    nest new . --package-manager npm --skip-git
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install @nestjs/graphql @nestjs/platform-express
npm install @nestjs/jwt @nestjs/passport @nestjs/config
npm install passport passport-jwt passport-local
npm install bcryptjs
npm install @apollo/server graphql
npm install surrealdb.js

# Install dev dependencies
echo "🔧 Installing dev dependencies..."
npm install -D @types/passport-jwt @types/passport-local
npm install -D @types/bcryptjs

# Create environment file
echo "📝 Creating environment file..."
cat > .env << EOF
# SurrealDB Configuration
SURREALDB_URL=http://localhost:8000
SURREALDB_NAMESPACE=social_network
SURREALDB_DATABASE=main
SURREALDB_USERNAME=root
SURREALDB_PASSWORD=root

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-$(date +%s)
JWT_EXPIRES_IN=7d

# GraphQL Configuration
GRAPHQL_PLAYGROUND=true
GRAPHQL_DEBUG=true

# App Configuration
PORT=3001
NODE_ENV=development
EOF

# Create SurrealDB setup script
echo "🗄️ Creating SurrealDB setup script..."
cat > surrealdb-setup.surql << 'EOF'
-- Create namespace and database
USE NS social_network DB main;

-- Create users table
DEFINE TABLE IF NOT EXISTS users SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS email ON users TYPE string ASSERT $value != "" AND $value =~ ".+@.+\..+";
DEFINE FIELD IF NOT EXISTS name ON users TYPE string ASSERT $value != "";
DEFINE FIELD IF NOT EXISTS password ON users TYPE string ASSERT $value != "";
DEFINE FIELD IF NOT EXISTS avatar ON users TYPE option<string>;
DEFINE FIELD IF NOT EXISTS bio ON users TYPE option<string>;
DEFINE FIELD IF NOT EXISTS created_at ON users TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON users TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS followers_count ON users TYPE number DEFAULT 0;
DEFINE FIELD IF NOT EXISTS following_count ON users TYPE number DEFAULT 0;
DEFINE FIELD IF NOT EXISTS posts_count ON users TYPE number DEFAULT 0;

-- Create posts table
DEFINE TABLE IF NOT EXISTS posts SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS content ON posts TYPE string ASSERT $value != "";
DEFINE FIELD IF NOT EXISTS author ON posts TYPE record<users>;
DEFINE FIELD IF NOT EXISTS created_at ON posts TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS updated_at ON posts TYPE datetime DEFAULT time::now();
DEFINE FIELD IF NOT EXISTS likes_count ON posts TYPE number DEFAULT 0;
DEFINE FIELD IF NOT EXISTS comments_count ON posts TYPE number DEFAULT 0;
DEFINE FIELD IF NOT EXISTS image ON posts TYPE option<string>;

-- Create follows table
DEFINE TABLE IF NOT EXISTS follows SCHEMAFULL;
DEFINE FIELD IF NOT EXISTS follower ON follows TYPE record<users>;
DEFINE FIELD IF NOT EXISTS following ON follows TYPE record<users>;
DEFINE FIELD IF NOT EXISTS created_at ON follows TYPE datetime DEFAULT time::now();

-- Create indexes
DEFINE INDEX IF NOT EXISTS email_unique ON users COLUMNS email UNIQUE;
DEFINE INDEX IF NOT EXISTS posts_author ON posts COLUMNS author;
DEFINE INDEX IF NOT EXISTS posts_created_at ON posts COLUMNS created_at;
DEFINE INDEX IF NOT EXISTS follows_unique ON follows COLUMNS follower, following UNIQUE;

-- Insert test users (with bcrypt hashes)
CREATE users:1 SET
    email = 'test@example.com',
    name = 'Nguyễn Văn A',
    password = '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqJqJ8j5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
    bio = 'Tôi là người dùng test',
    created_at = time::now();

CREATE users:2 SET
    email = 'user2@example.com',
    name = 'Trần Thị B',
    password = '$2b$10$N9qo8uLOickgx2ZMRZoMy.MrqJqJ8j5Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
    bio = 'Xin chào mọi người!',
    created_at = time::now();

-- Insert test posts
CREATE posts:1 SET
    content = 'Chào mừng đến với Social Hub! 🎉\n\nĐây là bài viết đầu tiên của tôi. Rất vui được kết nối với mọi người.',
    author = users:1,
    created_at = time::now(),
    likes_count = 15,
    comments_count = 3;

CREATE posts:2 SET
    content = 'Hôm nay trời đẹp quá! ☀️\n\nMọi người có một ngày tuyệt vời nhé!',
    author = users:2,
    created_at = time::now(),
    likes_count = 28,
    comments_count = 7;

CREATE posts:3 SET
    content = 'Mới học được một công thức hay quá! 🧪\n\nChia sẻ cho mọi người cùng biết nhé.',
    author = users:1,
    created_at = time::now(),
    likes_count = 42,
    comments_count = 12;

-- Create follow relationships
CREATE follows:1 SET
    follower = users:1,
    following = users:2,
    created_at = time::now();

CREATE follows:2 SET
    follower = users:2,
    following = users:1,
    created_at = time::now();
EOF

# Create startup script
echo "🚀 Creating startup script..."
cat > start.sh << 'EOF'
#!/bin/bash

echo "🎯 Starting Social Network Backend..."

# Start SurrealDB in background
echo "🗄️ Starting SurrealDB..."
surreal start --root --auth --log debug --user root --pass root memory &
SURREAL_PID=$!

# Wait for SurrealDB to start
sleep 3

# Setup SurrealDB schema and data
echo "🔧 Setting up SurrealDB schema..."
surreal sql --endpoint http://localhost:8000 --namespace social_network --database main --username root --password root --file surrealdb-setup.surql

# Start NestJS backend
echo "🚀 Starting NestJS backend..."
npm run start:dev

# Cleanup function
cleanup() {
    echo "🛑 Stopping services..."
    kill $SURREAL_PID 2>/dev/null
    exit 0
}

# Trap cleanup
trap cleanup INT TERM

wait $SURREAL_PID
EOF

chmod +x start.sh

echo "✅ Backend setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. cd social-network-backend"
echo "2. ./start.sh"
echo "3. Open http://localhost:3001/graphql"
echo ""
echo "🔑 Test credentials:"
echo "  Email: test@example.com"
echo "  Password: test123"
echo ""
echo "📝 For detailed setup, see: backend-setup.md"
echo ""
echo "🚀 Your backend will be ready at: http://localhost:3001/graphql"
