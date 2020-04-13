import { Role } from './role';

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: Role;
  token?: string;
}
