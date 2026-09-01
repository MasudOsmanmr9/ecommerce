import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Check } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'inventory' })
@Check(`"quantity" >= 0`)
export class Inventory {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @OneToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_variant_id' })
  productVariant!: ProductVariant;

  @Column({ name: 'quantity', type: 'integer', default: 0 })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
