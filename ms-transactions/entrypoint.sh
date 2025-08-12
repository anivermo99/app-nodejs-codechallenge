#!/bin/sh
env > /app/.env
npm run prisma:generate
npm run prisma:migrate:deploy
node dist/transactions/prisma/seed.js
node dist/main.js