FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_ENABLE_ADMIN_UI=false
ARG VITE_APP_ENV=production
ARG VITE_API_TARGET=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_ENABLE_ADMIN_UI=$VITE_ENABLE_ADMIN_UI
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_TARGET=$VITE_API_TARGET

RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

RUN find /usr/share/nginx/html -type d -exec chmod 755 {} + \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} +

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
