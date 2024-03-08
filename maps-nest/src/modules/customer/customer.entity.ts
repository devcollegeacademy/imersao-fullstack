import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  zipCode: string;

  @Column()
  number: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column({ default: false })
  active: boolean;
}
