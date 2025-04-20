# Etapa 1 - Build da aplicação Angular
FROM node:20-alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2 - Servir via NGINX
FROM nginx:alpine
COPY --from=build /app/dist/ensolvers-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
