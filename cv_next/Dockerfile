FROM node:22-alpine
WORKDIR /app

COPY . /app/.
ENV NEXT_PUBLIC_SUPABASE_URL=''
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=''


EXPOSE 3000

CMD ["npm", "install", "&&", "npm", "install", "next", "&&", "npm", "run", "dev"]