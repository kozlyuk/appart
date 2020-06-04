###########
# BUILDER #
###########

# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14 as build-stage

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /app

# Copies package.json and package-lock.json to Docker environment
COPY ./package*.json ./

# Installs all node packages
RUN npm install

# Copies everything over to Docker environment

COPY ./ /app/

# Make a build
RUN npm run build

#########
# FINAL #
#########

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.19-alpine

# Copy build files to new container
COPY --from=build-stage /app/build/ /usr/share/nginx/html

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
