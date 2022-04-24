FROM nginx:alpine

EXPOSE 80

RUN apk add yarn

COPY resources/nginx.conf /etc/nginx/nginx.conf
COPY resources/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

COPY . .

RUN yarn install --network-timeout 100000

RUN yarn build