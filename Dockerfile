FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci --ignore-scripts

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]