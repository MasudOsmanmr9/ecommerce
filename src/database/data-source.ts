import 'reflect-metadata';
import { DataSource } from 'typeorm';

// This file provides a placeholder DataSource configured from environment variables.
// Actual entities and migrations will be added in later phases.

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'windsurf',
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
});
