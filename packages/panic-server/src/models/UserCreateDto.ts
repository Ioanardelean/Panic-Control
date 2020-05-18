import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @Length(2, 255)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(8, 100)
  password: string;
}
