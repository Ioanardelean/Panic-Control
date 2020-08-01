import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './Entity';
import { Role } from './Role';

@Entity()
export class User extends AbstractEntity {
  @Column({ nullable: false, unique: true, length: 255 })
  username: string;

  @Column({ nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ nullable: false, length: 100, select: false })
  password: string;

  @ManyToMany(
    () => Role,
    role => role.users,
    {
      cascade: ['insert'],
    }
  )
  @JoinTable({ name: 'user_roles' })
  roles: Role[];

  @Column({ nullable: false })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ nullable: false })
  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
