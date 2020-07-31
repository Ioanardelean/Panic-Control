import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { ValidEmail } from '../../modules/utils/emailValidator';

export class UpdateMonitorDto {
  @Length(2, 100)
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsUrl({
    require_tld: false,
  })
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
}
