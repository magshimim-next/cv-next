FROM node:22-alpine
WORKDIR /app

ENV NEXT_PUBLIC_SUPABASE_URL=''
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=''


COPY package.json .
RUN npm install
RUN npm install next
COPY . .

RUN npm install && \
    npm cache clean --force && \
    rm -rf /tmp/*

EXPOSE 3000

CMD ["npm", "run", "dev"]