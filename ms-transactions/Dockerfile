FROM node:22-alpine3.21

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x ./entrypoint.sh

RUN npm run build

EXPOSE 3000

CMD ["/app/entrypoint.sh"]
