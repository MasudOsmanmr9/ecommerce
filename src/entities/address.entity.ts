import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'addresses' })
export class Address {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ name: 'label', type: 'varchar', length: 100, nullable: true })
  label?: string;

  @Column({ name: 'line1', type: 'varchar', length: 255 })
  line1!: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  line2?: string;

  @Column({ name: 'city', type: 'varchar', length: 100 })
  city!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 30 })
  postalCode!: string;

  @Column({ name: 'country', type: 'varchar', length: 100 })
  country!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
