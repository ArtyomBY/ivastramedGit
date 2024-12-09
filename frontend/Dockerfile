FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install react-scripts explicitly
RUN npm install react-scripts --legacy-peer-deps

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source
COPY . .

# Build for production
RUN npm run build

# Expose port
EXPOSE 3000

# Disable SSL certificate verification
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

# Start command
CMD ["npm", "start"]
