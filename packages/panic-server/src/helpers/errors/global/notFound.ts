import * as HttpStatus from 'http-status-codes';
import { BaseError } from './baseError';

export class NotFound extends BaseError {
  constructor() {
    super();
    this.statusCode = HttpStatus.NOT_FOUND;
    this.code = 'UNKNOWN_ENDPOINT';
    this.message = 'The requested endpoint does not exist.';
  }
}
