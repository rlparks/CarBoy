FROM node:alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN corepack enable

COPY . .
RUN yarn install
RUN yarn build

# clean up image
RUN rm -r public src

EXPOSE 3009

CMD ["yarn", "serve", "-p", "3009", "-s", "./dist"]
