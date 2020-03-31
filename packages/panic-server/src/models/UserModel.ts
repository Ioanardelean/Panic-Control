import { IsEmail, IsNotEmpty } from 'class-validator';
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
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true, length: 255 })
  @IsNotEmpty()
  username: string;

  @Column({ nullable: false, unique: true, length: 255 })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ nullable: false, length: 100 })
  @IsNotEmpty()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsNotEmpty()
  role: UserRole;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updateAt: Date;

  @Column({ nullable: true })
  accessToken: string;
}