FROM node:22-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]