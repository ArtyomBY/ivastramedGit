FROM node:18-alpine

WORKDIR /app/backend

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend source
COPY backend/ ./

# Expose port
EXPOSE 5000

# Set environment variable
ENV PORT=5000

# Start command
CMD ["npm", "start"]
