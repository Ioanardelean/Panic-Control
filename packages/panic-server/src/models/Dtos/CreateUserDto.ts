import { IsEmail, IsNotEmpty, Length, Validate } from 'class-validator';
import { Role } from '../../models/Role';
import { ValidPassword } from '../../modules/utils/passValid';

export class CreateUserDto {
  @Length(2, 100)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(8, 100)
  @IsNotEmpty()
  @Validate(ValidPassword)
  password: string;

  roles: Role[];
}
