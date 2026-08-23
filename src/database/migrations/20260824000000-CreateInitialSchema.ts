import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema20260824000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS app_metadata (
        id SERIAL PRIMARY KEY,
        key_name VARCHAR(255) NOT NULL UNIQUE,
        value TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS app_metadata;');
  }
}
