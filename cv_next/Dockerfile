FROM node:22-alpine
WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install next
COPY . .

RUN npm install && \
    npm cache clean --force && \
    rm -rf /tmp/*

EXPOSE 3000

RUN npm run build
CMD ["npm", "run", "start"]
