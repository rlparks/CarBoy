FROM node:bookworm

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 8081

CMD ["yarn", "start"]
