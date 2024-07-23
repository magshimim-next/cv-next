FROM node:22-alpine
WORKDIR /app

COPY . /app/.
ENV NEXT_PUBLIC_SUPABASE_URL=''
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=''

# Copy the startup script into the container
COPY startup.sh /usr/src/app/startup.sh

# Give execute permission to the script
RUN chmod +x /usr/src/app/startup.sh


EXPOSE 3000

CMD ["/usr/src/app/startup.sh"]