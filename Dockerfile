FROM node:14.14
WORKDIR /app
COPY . .
RUN npm install --force
EXPOSE 9000
CMD ["npm", "run", "prod"]