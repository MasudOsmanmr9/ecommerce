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

export default () => ({
  port: getNumber(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: getNumber(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME ?? process.env.DB_DATABASE ?? 'ecommerce',
    user: process.env.DB_USER ?? process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    logging: getBoolean(process.env.DB_LOGGING, false),
    poolMax: getNumber(process.env.DB_POOL_MAX, 20),
    poolMin: getNumber(process.env.DB_POOL_MIN, 5),
    connectionTimeout: getNumber(process.env.DB_CONNECTION_TIMEOUT, 2000),
    idleTimeout: getNumber(process.env.DB_IDLE_TIMEOUT, 30000),
  },
  logLevel: process.env.LOG_LEVEL ?? 'info',
});
