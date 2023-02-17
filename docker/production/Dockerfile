FROM node:16-alpine as frontend-build

WORKDIR /srv

ARG NODE_ENV production

COPY ./app/client/package.json ./
RUN npm install

COPY ./app/client/ ./

RUN npm run build


FROM node:16-alpine as backend

ARG NODE_ENV production

WORKDIR /srv

COPY ./app/server/package.json ./
RUN npm install

COPY ./app/server/ ./

CMD ["npm", "run", "start"]
