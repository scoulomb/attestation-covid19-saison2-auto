FROM node:lts-buster

WORKDIR /usr/src/app

# RUN chown node:node .
# USER node

COPY package*.json ./
COPY . .

# https://stackoverflow.com/questions/38323880/error-eacces-permission-denied
RUN npm install -g --unsafe-perm=true --allow-root
RUN npm run build:dev

ENTRYPOINT [ "npx", "serve", "dist" ]
