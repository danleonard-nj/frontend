FROM node:22-alpine as builder

# Set the working directory to /app inside the container
WORKDIR /app

# Copy app files
COPY . .
# RUN apk add --no-cache bash

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci --legacy-peer-deps 

ENV GENERATE_SOURCEMAP=false

# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:alpine as production

ENV NODE_ENV production
RUN apk add --no-cache bash

# Copy built assets from `builder` image
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]