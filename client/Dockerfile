FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3009

CMD ["yarn", "serve", "-p", "3009", "-s", "./dist"]
