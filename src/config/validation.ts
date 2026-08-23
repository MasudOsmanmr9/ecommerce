import Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development','production','test','provision').default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().allow('', null),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('user'),
  DB_PASSWORD: Joi.string().default('password'),
  DB_DATABASE: Joi.string().default('windsurf'),
  LOG_LEVEL: Joi.string().default('info'),
});
