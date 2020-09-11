import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { AbstractEntity } from './Entity';
import { Role } from './Role';

@Entity()
@Index('user_username_email_IDX', ['username', 'email'])
@Unique('user_username_email_UNIQUE', ['username', 'email'])
export class User extends AbstractEntity {
  @Column({ nullable: false, length: 255, unique: true })
  username: string;

  @Column({ nullable: false, length: 255, unique: true })
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
