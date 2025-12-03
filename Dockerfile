FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

#소스코드 복사
COPY . .

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]

