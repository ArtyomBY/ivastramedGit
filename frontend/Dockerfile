FROM node:18-alpine

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
