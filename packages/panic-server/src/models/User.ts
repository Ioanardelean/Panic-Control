import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from './Entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: false, unique: true, length: 255 })
  username: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ nullable: false, length: 100, select: false })
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
