import {
  IsInt,
  IsNotEmpty,
  IsOptional,

  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { ValidEmail } from '../../modules/utils/emailValidator';
import { ValidUrl } from '../../modules/utils/urlValid';
import { User } from '../User';

export class CreateProjectDto {
  @Length(2, 100)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @Validate(ValidUrl)
  url: string;

  @IsNotEmpty()
  @Validate(ValidEmail)
  receiver: string;

  @IsNotEmpty()
  @IsInt()
  @Min(10)
  @Max(60)
  ping: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(60)
  monitorInterval: number;

  @IsOptional()
  emailTemplate: string;
  user: User;
}
