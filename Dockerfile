FROM node:latest

WORKDIR /usr/app/frontend

RUN npm install -g @angular/cli

COPY package.json /usr/app/frontend
COPY angular.json /usr/app/frontend
COPY tsconfig.app.json /usr/app/frontend
COPY tsconfig.json  /usr/app/frontend
COPY tsconfig.spec.json  /usr/app/frontend
COPY ./src/ /usr/app/frontend/

RUN npm ci

EXPOSE 4200
CMD ng serve --host "0.0.0.0" --disable-host-check