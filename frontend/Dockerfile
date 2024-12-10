# Use Node.js as base image
FROM node:18-alpine

# Install serve
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy build files
COPY build ./build

# Expose port
EXPOSE 3000

# Add environment variable
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Add environment variable
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Start command
CMD ["serve", "-s", "build", "-l", "3000"]
