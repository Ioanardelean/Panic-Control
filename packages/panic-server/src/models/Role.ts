import { Column, Entity, Index, ManyToMany, Unique } from 'typeorm';
import { AbstractEntity } from './Entity';
import { User } from './User';

@Entity()
@Unique('role_name_UNIQUE', ['name'])
@Index('role_name_IDX', ['name'])
export class Role extends AbstractEntity {
  @Column()
  private name: string;
  @ManyToMany(
    () => User,
    (user: User) => user.Roles
  )
  private users: User[];
  constructor() {
    super();
  }
  get Name(): string {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }

  get Users(): User[] {
    return this.users;
  }

  set Users(users: User[]) {
    this.users = users;
  }
}
