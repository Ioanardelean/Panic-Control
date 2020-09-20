import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './Entity';
import { Role } from './Role';

@Entity()
@Index('user_username_email_IDX', ['username', 'email'])
@Unique('user_username_email_UNIQUE', ['username', 'email'])
export class User extends AbstractEntity {
  @Column({ nullable: false, length: 255, unique: true })
  private username: string;

  @Column({ nullable: false, length: 255, unique: true })
  private email: string;

  @Column({ nullable: false, length: 100, select: false })
  private password: string;

  @ManyToMany(
    () => Role,
    role => role.Users,
    {
      cascade: true,
    }
  )
  @JoinTable({ name: 'user_roles' })
  private roles: Role[];

  @Column({ nullable: false })
  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date;

  @Column({ nullable: false })
  @UpdateDateColumn({ name: 'updated_at' })
  private updateAt: Date;

  constructor() {
    super();
  }
  get Username(): string {
    return this.username;
  }

  set Username(username: string) {
    this.username = username;
  }
  get Email(): string {
    return this.email;
  }

  set Email(email: string) {
    this.email = email;
  }
  get Password(): string {
    return this.password;
  }

  set Password(password: string) {
    this.password = password;
  }
  get CreatedAt(): Date {
    return this.createdAt;
  }

  set CreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }
  get UpdatedAt(): Date {
    return this.updateAt;
  }

  set UpdatedAt(updatedAt: Date) {
    this.updateAt = updatedAt;
  }
  get Roles(): Role[] {
    return this.roles;
  }

  set Roles(roles: Role[]) {
    this.roles = roles;
  }
}
