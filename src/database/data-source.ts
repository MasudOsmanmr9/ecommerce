import 'reflect-metadata';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import "dotenv/config"

const getNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true' || value === '1';
};

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL ?? undefined,
  host: process.env.DB_HOST ?? 'localhost',
  port: getNumber(process.env.DB_PORT, 5432),
  username: process.env.DB_USER ?? process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME ?? process.env.DB_DATABASE ?? 'ecommerce',
  synchronize: false,
  logging: getBoolean(process.env.DB_LOGGING, false),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
  extra: {
    max: getNumber(process.env.DB_POOL_MAX, 20),
    min: getNumber(process.env.DB_POOL_MIN, 5),
    idleTimeoutMillis: getNumber(process.env.DB_IDLE_TIMEOUT, 30000),
    connectionTimeoutMillis: getNumber(process.env.DB_CONNECTION_TIMEOUT, 2000),
  },
});
