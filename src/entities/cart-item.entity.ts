import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index, Check } from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from './product-variant.entity';

@Entity({ name: 'cart_items' })
@Check(`"quantity" > 0`)
@Index('uq_cart_item_cart_variant', ['cart', 'productVariant'], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Cart, { onDelete: 'CASCADE' })
  cart!: Cart;

  @ManyToOne(() => ProductVariant, { onDelete: 'RESTRICT' })
  productVariant!: ProductVariant;

  @Column({ name: 'quantity', type: 'integer', default: 1 })
  quantity!: number;
}
