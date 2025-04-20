#!/bin/bash

echo "🚀 Starting EnsolversChallenge full stack application..."

cd "$(dirname "$0")"

echo "📦 Starting PostgreSQL via Docker..."
docker compose -f backend/docker/docker-compose.yml up -d

echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

echo "🔧 Starting backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!
cd ..

echo "⏳ Waiting for backend to start..."
sleep 15

echo "🌐 Starting frontend..."
cd frontend
npm install
ng serve &
FRONTEND_PID=$!
cd ..

echo "✅ All services started."
echo "🌍 Frontend: http://localhost:4200"
echo "🔙 Backend:  http://localhost:8080"
echo "🛢️ Database: PostgreSQL running in Docker"

wait $BACKEND_PID $FRONTEND_PID
