# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm run install:all

# Copy source files
COPY . .

# Build frontend
RUN npm run build:frontend

# Build backend
RUN npm run build:backend

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=build /app/frontend/build ./frontend/build

# Copy backend files
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package*.json ./backend/

# Install production dependencies
WORKDIR /app/backend
RUN npm ci --only=production

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/index.js"]
