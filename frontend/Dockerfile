FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

ARG API_URL="https://invoice-backend-66s6.onrender.com"

ENV NEXT_PUBLIC_API_URL=$API_URL
# ------------------------------

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]