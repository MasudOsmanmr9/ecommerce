import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity({ name: 'refunds' })
export class Refund {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Payment, { onDelete: 'SET NULL', nullable: true })
  payment?: Payment | null;

  @Column({ name: 'amount_cents', type: 'bigint', default: 0 })
  amountCents!: string | number;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'pending' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
