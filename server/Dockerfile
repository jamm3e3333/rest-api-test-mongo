FROM node:14.15.0-alpine
WORKDIR /src
COPY package.json .
RUN npm cache clear --force && npm install
COPY . .