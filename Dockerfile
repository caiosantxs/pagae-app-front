# === ESTÁGIO 1: Construção (Build) ===
# Usa o node.js para instalar os pacotes e compilar o TypeScript
FROM node:20-alpine AS build
WORKDIR /app

# Copia os arquivos de dependência e instala tudo
COPY package*.json ./
RUN npm install

# Copia o resto do código fonte e faz o build de produção
COPY . .
RUN npm run build --configuration=production

# === ESTÁGIO 2: Servidor Web (Nginx) ===
# Usa o Nginx para servir os arquivos HTML/JS
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Cria uma configuração customizada para o Angular (Redireciona tudo para o index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copia os arquivos gerados no Estágio 1 para a pasta pública do Nginx
COPY --from=build /app/dist/pagae-app-front/browser /usr/share/nginx/html

# Libera a porta 80 (padrão de internet)
EXPOSE 80

# Inicia o servidor
CMD ["nginx", "-g", "daemon off;"]
