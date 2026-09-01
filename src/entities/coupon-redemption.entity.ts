import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { Coupon } from './coupon.entity';
import { User } from './user.entity';

@Entity({ name: 'coupon_redemptions' })
@Index('uq_coupon_redemptions_coupon_user', ['coupon', 'user'], { unique: true })
export class CouponRedemption {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Coupon, { onDelete: 'CASCADE' })
  coupon!: Coupon;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @CreateDateColumn({ name: 'redeemed_at', type: 'timestamptz' })
  redeemedAt!: Date;
}
