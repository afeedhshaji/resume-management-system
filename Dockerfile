FROM node:8.10.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3035

CMD ["npm", "start"]