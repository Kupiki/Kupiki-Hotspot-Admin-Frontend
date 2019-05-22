FROM node:8 as build-package

ARG CLIENT_PROTOCOL
ARG CLIENT_HOST
ARG CLIENT_PORT
ARG SERVER_PROTOCOL
ARG SERVER_HOST
ARG SERVER_PORT

ENV CLIENT_PROTOCOL=$CLIENT_PROTOCOL
ENV CLIENT_HOST=$CLIENT_HOST
ENV CLIENT_PORT=$CLIENT_PORT
ENV SERVER_PROTOCOL=$SERVER_PROTOCOL
ENV SERVER_HOST=$SERVER_HOST
ENV SERVER_PORT=$SERVER_PORT

RUN mkdir -p /src
WORKDIR /src
COPY app/ .
RUN npm install webpack webpack-cli
RUN npm install
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build-package /src/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]