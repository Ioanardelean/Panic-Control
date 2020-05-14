import * as HttpStatus from 'http-status-codes';
import { BaseError } from './baseError';

export class UnprocessableEntity extends BaseError {
  constructor(message: string) {
    super();
    this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    this.code = 'UNPROCESSABLE_ENTITY';
    this.message = message;
  }
}
