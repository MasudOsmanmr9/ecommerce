# E-commerce backend

## Docker commands

Start PostgreSQL:

```bash
docker compose up -d
```

Stop PostgreSQL:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f postgres
```

Open a database shell:

```bash
docker exec -it ecommerce-postgres psql -U postgres -d ecommerce
```

## Local environment

Copy `.env.example` to `.env` and adjust values before running the app:

```bash
copy .env.example .env
```

## Useful commands

```bash
npm run migration:generate
npm run migration:run
npm run migration:revert
npm run build
npm test
```
