import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { configValidationSchema } from './config/validation';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'ecommerce'),
        synchronize: false,
        logging: configService.get<boolean>('DB_LOGGING', false),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        extra: {
          max: configService.get<number>('DB_POOL_MAX', 20),
          min: configService.get<number>('DB_POOL_MIN', 5),
          idleTimeoutMillis: configService.get<number>('DB_IDLE_TIMEOUT', 30000),
          connectionTimeoutMillis: configService.get<number>('DB_CONNECTION_TIMEOUT', 2000),
        },
      }),
    }),
    HealthModule,
  ],
})
export class AppModule {}
