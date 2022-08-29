
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD [ "yarn", "app:portfolio" ]
