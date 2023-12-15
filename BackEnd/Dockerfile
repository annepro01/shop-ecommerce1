FROM node:alpine
WORKDIR /app
COPY package*.json /app/
RUN npm install 
COPY . .
ENV PORT = 2030
EXPOSE 2030
CMD ["npm", "run", "server"]


