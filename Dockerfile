# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install global dependencies
RUN npm install -g npm@latest

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install root dependencies
RUN npm install

# Copy entire project
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built artifacts
COPY --from=build /app/frontend/build ./frontend/build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules

# Install serve for hosting static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start command
CMD ["serve", "-s", "frontend/build", "-l", "3000"]
