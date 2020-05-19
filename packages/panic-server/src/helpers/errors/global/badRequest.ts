import * as HttpStatus from 'http-status-codes';
import { BaseError } from './baseError';

export class BadRequest extends BaseError {
  constructor(error: any) {
    super();
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = 'BAD_REQUEST';
    this.message = error;
  }
}
