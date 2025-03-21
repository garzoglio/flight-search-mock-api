# --- Build Stage ---
    FROM node:22.6.0 AS build
    WORKDIR /src/app
    COPY package*.json ./
    RUN npm install --include=dev
    COPY . .
    RUN npm run build
    
    # --- Runtime Stage ---
    FROM node:22.6.0-slim
    WORKDIR /usr/src/app
    COPY --from=build /src/app/package*.json ./
    COPY --from=build /src/app/dist ./dist/
    # Install only production dependencies
    RUN npm install --omit=dev
    ARG PORT=8080
    EXPOSE 8080
    CMD ["node", "--enable-source-maps", "dist/index.js"] # Updated CMD