# Descripción
Tienda online en Next.js + Tailwind CSS + BetterAuth

## Desplegar en dev

1. Clonar el repositorio.
2. Crear una copia del ```.env.template```y renombrarlo a ```.env```y cambiar las variables de entorno.
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar el seed ```npx prisma db seed```
7. Generar el BETTER_AUTH_SECRET (https://www.better-auth.com/docs/installation)
8. Correr el proyecto ```npm run dev```

## Desplegar en producción