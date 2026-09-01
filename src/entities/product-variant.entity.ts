import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'product_variants' })
@Index('uq_product_variants_sku', ['sku'], { unique: true })
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product!: Product;

  @Column({ name: 'sku', type: 'varchar', length: 128 })
  sku!: string;

  @Column({ name: 'price_cents', type: 'bigint', default: 0 })
  priceCents!: string | number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
