# Use an official Node.js runtime as a base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install -g npm@10.2.5

# Install dependencies Copy the rest of the application code to the working directory
COPY . .

#ENV PATH /usr/local/bin:$PATH

# Expose the port that the app will run on (e.g., 3000 for a typical React app)
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "run", "start"]
