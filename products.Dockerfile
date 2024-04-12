# Use the official Node.js image as a base
FROM node:18

WORKDIR /grpc
COPY ./grpc/product.proto ./
COPY ./grpc/order.proto ./
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory
COPY products-service/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY ./products-service .

RUN npm run build

# Expose the port your app runs on
EXPOSE 5000

# Command to run your app using npm
CMD ["npm", "run", "start:prod"]
