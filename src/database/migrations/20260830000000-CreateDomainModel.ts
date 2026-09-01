import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDomainModel20260830000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure pgcrypto is available for gen_random_uuid()
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Users
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) NOT NULL,
        status varchar(50) NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        deleted_at timestamptz NULL
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_users_email_active ON users(email) WHERE deleted_at IS NULL;`);

    // Addresses
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS addresses (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL,
        label varchar(100),
        line1 varchar(255) NOT NULL,
        line2 varchar(255),
        city varchar(100) NOT NULL,
        postal_code varchar(30) NOT NULL,
        country varchar(100) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Categories
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        slug varchar(255) NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // Products
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title varchar(255) NOT NULL,
        description text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // product_categories join
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id uuid NOT NULL,
        category_id uuid NOT NULL,
        CONSTRAINT pk_product_categories PRIMARY KEY (product_id, category_id),
        CONSTRAINT fk_pc_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    // Product variants
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL,
        sku varchar(128) NOT NULL,
        price_cents bigint NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_product_variants_sku ON product_variants(sku);`);

    // Inventory
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS inventory (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_variant_id uuid NOT NULL UNIQUE,
        quantity integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_inventory_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
      );
    `);

    // Carts
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS carts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NULL,
        status varchar(50) NOT NULL DEFAULT 'active',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Cart items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        cart_id uuid NOT NULL,
        product_variant_id uuid NOT NULL,
        quantity integer NOT NULL DEFAULT 1,
        CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
        CONSTRAINT fk_cart_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_cart_item_cart_variant ON cart_items(cart_id, product_variant_id);`);

    // Orders
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NULL,
        status varchar(50) NOT NULL DEFAULT 'pending',
        total_cents bigint NOT NULL DEFAULT 0,
        placed_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Order items
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL,
        product_variant_id uuid NOT NULL,
        quantity integer NOT NULL DEFAULT 1,
        unit_price_cents bigint NOT NULL DEFAULT 0,
        CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        CONSTRAINT fk_order_items_variant FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE RESTRICT
      );
    `);

    // Payments
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NULL,
        amount_cents bigint NOT NULL DEFAULT 0,
        status varchar(50) NOT NULL DEFAULT 'pending',
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      );
    `);

    // Payment attempts
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS payment_attempts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        payment_id uuid NOT NULL,
        provider varchar(100),
        attempt_data jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_payment_attempts_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
      );
    `);

    // Refunds
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS refunds (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        payment_id uuid NULL,
        amount_cents bigint NOT NULL DEFAULT 0,
        status varchar(50) NOT NULL DEFAULT 'pending',
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
      );
    `);

    // Coupons
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        code varchar(64) NOT NULL UNIQUE,
        discount_type varchar(20) NOT NULL,
        discount_amount_cents bigint NOT NULL DEFAULT 0,
        valid_from timestamptz,
        valid_to timestamptz,
        usage_limit integer,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // Coupon redemptions
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS coupon_redemptions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        coupon_id uuid NOT NULL,
        user_id uuid NOT NULL,
        redeemed_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT fk_cr_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
        CONSTRAINT fk_cr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_coupon_redemptions_coupon_user ON coupon_redemptions(coupon_id, user_id);`);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order
    await queryRunner.query(`DROP INDEX IF EXISTS uq_coupon_redemptions_coupon_user;`);
    await queryRunner.query(`DROP TABLE IF EXISTS coupon_redemptions;`);
    await queryRunner.query(`DROP TABLE IF EXISTS coupons;`);
    await queryRunner.query(`DROP TABLE IF EXISTS refunds;`);
    await queryRunner.query(`DROP TABLE IF EXISTS payment_attempts;`);
    await queryRunner.query(`DROP TABLE IF EXISTS payments;`);
    await queryRunner.query(`DROP TABLE IF EXISTS order_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders;`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_cart_item_cart_variant;`);
    await queryRunner.query(`DROP TABLE IF EXISTS cart_items;`);
    await queryRunner.query(`DROP TABLE IF EXISTS carts;`);
    await queryRunner.query(`DROP TABLE IF EXISTS inventory;`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_product_variants_sku;`);
    await queryRunner.query(`DROP TABLE IF EXISTS product_variants;`);
    await queryRunner.query(`DROP TABLE IF EXISTS product_categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS products;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories;`);
    await queryRunner.query(`DROP TABLE IF EXISTS addresses;`);
    await queryRunner.query(`DROP INDEX IF EXISTS uq_users_email_active;`);
    await queryRunner.query(`DROP TABLE IF EXISTS users;`);
  }
}
