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
  protected constructor() {
    //
  }
  get Name(): string {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }
  get Description(): string {
    return this.description;
  }

  set Description(description: string) {
    this.description = description;
  }
  get Receiver(): string {
    return this.receiver;
  }

  set Receiver(receiver: string) {
    this.receiver = receiver;
  }

  get Ping(): number {
    return this.ping;
  }

  set Ping(ping: number) {
    this.ping = ping;
  }
  get MonitorInterval(): number {
    return this.monitorInterval;
  }

  set MonitorInterval(monitorInterval: number) {
    this.monitorInterval = monitorInterval;
  }

  get Url(): string {
    return this.url;
  }

  set Url(url: string) {
    this.url = url;
  }

  get EmailTemplate(): string {
    return this.emailTemplate;
  }

  set EmailTemplate(emailTemplate: string) {
    this.emailTemplate = emailTemplate;
  }
}
