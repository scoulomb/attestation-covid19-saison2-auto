FROM node:lts-buster as build
	WORKDIR /usr/src/app

	# RUN chown node:node .
	# USER node

	COPY package*.json ./
	COPY . .

	# https://stackoverflow.com/questions/38323880/error-eacces-permission-denied
	RUN npm install -g --unsafe-perm=true --allow-root
	#  needed by dokcerhub and gcloudrun
	RUN npm install cross-env 
	RUN npm run build:dev

FROM node:lts-alpine3.12
	WORKDIR /app
	COPY --from=build /usr/src/app/dist ./dist
	ENTRYPOINT [ "npx", "serve", "dist" ]
