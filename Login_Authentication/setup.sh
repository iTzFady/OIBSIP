#!/bin/bash

# Create database
echo ""
echo "Creating PostgreSQL database..."
createdb auth_project already exist 2>/dev/null || echo "Database might already exist"

# Initialize schema
echo ""
echo "Initializing database schema..."
psql -U postgres -d auth_project -f db/init.sql || echo "Schema initialization had issues"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo ""
  echo "Creating .env file from template..."
  cp .env.example .env
  echo "Please edit .env file with your database credentials"
else
  echo ""
  echo ".env file already exists"
fi

# Install dependencies
echo ""
echo "Installing npm dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your database credentials"
echo "  2. Run: npm start"
echo ""
echo "Server will be available at http://localhost:3000"
