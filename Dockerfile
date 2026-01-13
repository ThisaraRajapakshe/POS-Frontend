# Stage 1: The Build (Using Node.js)
# We use 'alpine' versions to keep it small
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions first (to cache them)
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the code
COPY . .
# 1. Define a build argument named BUILD_CONFIGURATION
# We set the default to 'production' so CI/CD is safe by default.
ARG BUILD_CONFIGURATION=production
# Build the app (Production mode)
RUN npm run build -- --configuration $BUILD_CONFIGURATION

# Stage 2: The Server (Using Nginx)
FROM nginx:alpine

# Copy the built Angular files from Stage 1 to Nginx's html folder
# NOTE: Replace 'POS_System' below with the actual project name from your package.json or angular.json!
COPY --from=build /app/dist/pos/browser /usr/share/nginx/html

# Copy our custom config (we will create this next)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Open port 80
EXPOSE 80