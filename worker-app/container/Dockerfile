FROM ubuntu:focal

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get update && \
    apt-get upgrade -y && \
    apt install -y nano && \
    apt-get install -y nodejs ffmpeg

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

CMD [ "node", "index.js" ]
