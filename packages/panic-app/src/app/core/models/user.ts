import { Role } from './role';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  token?: string;
}
