import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
  order?: Order | null;

  @Column({ name: 'amount_cents', type: 'bigint', default: 0 })
  amountCents!: string | number;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
