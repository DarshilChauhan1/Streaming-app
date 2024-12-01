# Use a smaller base image with Node.js
FROM node:18-buster-slim

# Install necessary packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json for caching layer optimization
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Start the app
CMD ["node", "index.js"]
