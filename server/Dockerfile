FROM node:bookworm

WORKDIR /app

COPY package.json yarn.lock ./

COPY . .

RUN corepack enable
RUN yarn install

EXPOSE 8081

CMD ["yarn", "start"]
