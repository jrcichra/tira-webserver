FROM node:alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install --network-timeout 100000

RUN yarn build

FROM nginx:alpine

EXPOSE 80

COPY resources/nginx.conf /etc/nginx/nginx.conf
COPY resources/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

COPY --from=builder /app/dist dist