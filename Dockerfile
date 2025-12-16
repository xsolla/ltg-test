FROM node:20-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git
RUN npm install -g pnpm
RUN pnpm i
RUN pnpm run build

EXPOSE 3000

CMD [ "pnpm", "run", "start" ]
