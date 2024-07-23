FROM node:22-alpine
WORKDIR /app

COPY . /app/.
ENV NEXT_PUBLIC_SUPABASE_URL=''
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=''
RUN chmod +x startup.sh


EXPOSE 3000

CMD ["./startup.sh"]