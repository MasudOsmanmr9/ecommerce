import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Payment } from './payment.entity';

@Entity({ name: 'payment_attempts' })
export class PaymentAttempt {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => Payment, { onDelete: 'CASCADE' })
  payment!: Payment;

  @Column({ name: 'provider', type: 'varchar', length: 100, nullable: true })
  provider?: string;

  @Column({ name: 'attempt_data', type: 'jsonb', nullable: true })
  attemptData?: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
