# Build stage
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files for both frontend and backend
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci
RUN cd backend && npm ci

# Copy source files
COPY . .

# Build backend
RUN cd backend && npm run build

# Build frontend
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built files and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY package*.json ./
COPY backend/package*.json ./backend/

# Set production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
