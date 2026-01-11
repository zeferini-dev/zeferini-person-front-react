FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com --force para ignorar plataforma específica
RUN npm install --force --legacy-peer-deps

# Copiar código fonte
COPY . .

# Expor porta Vite
EXPOSE 3200

# Rodar dev server com host 0.0.0.0 para aceitar conexões de fora do container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
