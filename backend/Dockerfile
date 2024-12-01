FROM node:22-apline

# Set the working directory
WORKDIR /ubuntu/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 4000

# Run the application
CMD ["npm", "run", "start"]