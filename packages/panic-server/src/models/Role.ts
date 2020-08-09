import { Column, Entity, ManyToMany, Unique, Index } from 'typeorm';
import { AbstractEntity } from './Entity';
import { User } from './User';

@Entity()
@Unique('role_name_UNIQUE', ['name'])
@Index('role_name_IDX', ['name'])
export class Role extends AbstractEntity {
  @Column()
  name: string;
  @ManyToMany(
    () => User,
    (user: User) => user.roles
  )
  users: User[];
}
