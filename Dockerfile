# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source
COPY frontend ./

# Build frontend
RUN npm run build

# Build stage for backend
FROM node:18-alpine AS backend-build

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source
COPY backend ./

# Build backend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy frontend build
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy backend build and dependencies
COPY --from=backend-build /app/backend/dist ./backend/dist
COPY --from=backend-build /app/backend/node_modules ./backend/node_modules
COPY --from=backend-build /app/backend/package*.json ./backend/

# Copy root package.json for scripts
COPY package*.json ./

# Install serve for frontend
RUN npm install -g serve

# Expose ports
EXPOSE 3000 5000

# Start command
CMD ["sh", "-c", "npm run start:backend & npm run start:frontend"]
