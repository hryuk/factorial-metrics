FROM node:17.9-alpine
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build
RUN npm prune --production
EXPOSE 3000
ENTRYPOINT ["npm", "run", "start:prod"]