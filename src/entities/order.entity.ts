import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user?: User | null;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'pending' })
  status!: string;

  @Column({ name: 'total_cents', type: 'bigint', default: 0 })
  totalCents!: string | number;

  @CreateDateColumn({ name: 'placed_at', type: 'timestamptz' })
  placedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
