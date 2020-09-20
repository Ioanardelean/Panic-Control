import { IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 100)
  username: string;

  @IsEmail()
  email: string;
  protected constructor() {
    //
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
}
