# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the local code to the container image.
COPY . .

# Run the deploy-commands script.
RUN node deploy-commands.js

# Run the web service on container startup.
CMD [ "node", "index.js" ]