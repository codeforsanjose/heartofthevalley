# syntax=docker/dockerfile:1

ARG NODE_VERSION

FROM docker.io/library/node:${NODE_VERSION} as node_modules_cache
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /usr/src/app
COPY ./app/server/package*.json .
RUN npm install --from-lockfile


FROM docker.io/library/node:${NODE_VERSION}
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /usr/src/app
COPY ./app/server ./
COPY --from=node_modules_cache /usr/src/app/node_modules /usr/src/app/node_modules
EXPOSE 3001/tcp
CMD ["npm", "run", "start"]
