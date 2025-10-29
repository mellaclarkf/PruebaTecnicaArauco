FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache bash git

COPY package*.json ./
RUN npm install

RUN npm install -D tailwindcss@3.4.14 postcss autoprefixer

COPY . .

EXPOSE 3001
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3001"]
