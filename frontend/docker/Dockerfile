FROM node:20-alpine as build

WORKDIR /app

COPY frontend/package*.json ./

RUN npm install

COPY frontend/. .

RUN npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/note-project /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
