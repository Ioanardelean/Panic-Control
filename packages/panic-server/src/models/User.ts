import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ nullable: false, unique: true, length: 255 })
  username: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ nullable: false, length: 100 })
  password: string;

  @Column({ nullable: false, type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ nullable: false })
  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: false })
  @UpdateDateColumn()
  updateAt: Date;
}
