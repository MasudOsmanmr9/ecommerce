import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'coupons' })
export class Coupon {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'code', type: 'varchar', length: 64, unique: true })
  code!: string;

  @Column({ name: 'discount_type', type: 'varchar', length: 20 })
  discountType!: string;

  @Column({ name: 'discount_amount_cents', type: 'bigint', default: 0 })
  discountAmountCents!: string | number;

  @Column({ name: 'valid_from', type: 'timestamptz', nullable: true })
  validFrom?: Date | null;

  @Column({ name: 'valid_to', type: 'timestamptz', nullable: true })
  validTo?: Date | null;

  @Column({ name: 'usage_limit', type: 'integer', nullable: true })
  usageLimit?: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
