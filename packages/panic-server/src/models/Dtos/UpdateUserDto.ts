import { IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
  @Length(2, 100)
  username: string;

  @IsEmail()
  email: string;
}
