# Single-stage Dockerfile for serving pre-built Angular app with Nginx
FROM nginx:alpine

# Copy the pre-built app (build is done in CI/CD pipeline with npm run build)
# For Angular 17, the output is in dist/movieapp/browser/
COPY dist/movieapp/browser/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install curl for health checks
RUN apk add --no-cache curl

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
