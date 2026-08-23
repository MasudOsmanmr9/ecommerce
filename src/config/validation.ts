import Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.alternatives().try(Joi.string(), Joi.valid(null)).default('ecommerce'),
  DB_USER: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_LOGGING: Joi.boolean().default(false),
  DB_POOL_MAX: Joi.number().min(1).default(20),
  DB_POOL_MIN: Joi.number().min(0).default(5),
  DB_CONNECTION_TIMEOUT: Joi.number().min(0).default(2000),
  DB_IDLE_TIMEOUT: Joi.number().min(0).default(30000),
  DATABASE_URL: Joi.string().allow('', null),
  DB_DATABASE: Joi.string().allow('', null),
  DB_USERNAME: Joi.string().allow('', null),
  LOG_LEVEL: Joi.string().default('info'),
});
