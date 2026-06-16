# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG BUILD_CONFIGURATION=production
RUN npm run build -- --configuration $BUILD_CONFIGURATION

# Stage 2: Nginx Server
FROM nginx:alpine

# ✅ This path is 100% correct for your angular.json
COPY --from=build /app/dist/pos/browser /usr/share/nginx/html

# ✅ Remember to create this file in your Frontend folder
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80