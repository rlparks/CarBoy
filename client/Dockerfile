FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

CMD ["yarn", "serve", "-p", "80", "-s", "./dist"]
