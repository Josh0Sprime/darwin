FROM node:16.14.2

WORKDIR /usr/src/app

COPY ./back-end/ .

ENV TZ America/Santiago

RUN npm install

CMD [ "node", "index.js" ]
