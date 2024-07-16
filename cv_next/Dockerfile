FROM node:22-alpine
WORKDIR /app

COPY . /app/.
ENV NEXT_PUBLIC_SUPABASE_URL=''
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=''
RUN npm install
RUN npm install next
EXPOSE 3000

CMD ["npm", "run", "dev"]