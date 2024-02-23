# syntax=docker/dockerfile:1

ARG NODE_VERSION

FROM docker.io/library/node:${NODE_VERSION} as node_modules_cache
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /opt
COPY ./app/client/package*.json ./
RUN npm update --global npm \
 && npm install

FROM docker.io/library/node:${NODE_VERSION} as dev-frontend
LABEL org.opensourcesanjose.app="heartofthevalley"
WORKDIR /usr/src/app
COPY ./app/client ./
COPY --from=node_modules_cache /opt/node_modules /usr/src/app/node_modules
EXPOSE 3000/tcp
CMD ["npm", "run", "start"]



FROM nginx as dev
LABEL org.opensourcesanjose.app="heartofthevalley"
COPY docker/frontend/default.conf /etc/nginx/conf.d/default.conf
# COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 3000/tcp
