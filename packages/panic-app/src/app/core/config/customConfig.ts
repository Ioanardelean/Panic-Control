import { Injectable } from '@angular/core';
import { Config } from './config';

@Injectable()
export class CustomConfig extends Config {
  apiBaseUrl = 'http://localhost:3000';
}
