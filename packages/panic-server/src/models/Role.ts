import { Column, Entity, ManyToMany } from 'typeorm';
import { AbstractEntity } from './Entity';
import { User } from './User';

@Entity()
export class Role extends AbstractEntity {
  @Column()
  name: string;
  @ManyToMany(
    () => User,
    (user: User) => user.roles
  )
  users: User[];
}
