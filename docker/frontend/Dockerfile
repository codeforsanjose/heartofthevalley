# syntax=docker/dockerfile:1

ARG NODE_VERSION

FROM docker.io/library/node:${NODE_VERSION} as node_modules_cache
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /opt
COPY ./app/client/package*.json ./
RUN npm install

FROM docker.io/library/node:${NODE_VERSION} as dev
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /usr/src/app
COPY --from=node_modules_cache /opt/node_modules /usr/src/app/node_modules
EXPOSE 3000/tcp
CMD ["npm", "run", "start"]