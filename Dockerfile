# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Build the frontend
RUN npm run build

# ---------- Production stage ----------
FROM nginx:1.27-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]