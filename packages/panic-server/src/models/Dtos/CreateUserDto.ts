import { IsEmail, Length, Validate } from 'class-validator';
import { ValidPassword } from '../../modules/utils/passValid';

export class CreateUserDto {
  @Length(2, 100)
  username: string;

  @IsEmail()
  email: string;

  @Length(8, 100)
  @Validate(ValidPassword)
  password: string;
}
