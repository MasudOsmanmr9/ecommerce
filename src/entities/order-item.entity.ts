import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Check } from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'order_items' })
@Check(`"quantity" > 0`)
export class OrderItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  order!: Order;

  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  productVariant!: ProductVariant;

  @Column({ name: 'quantity', type: 'integer', default: 1 })
  quantity!: number;

  @Column({ name: 'unit_price_cents', type: 'bigint', default: 0 })
  unitPriceCents!: string | number;
}
