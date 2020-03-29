import config from 'config';
import { Observable, Subscriber } from 'rxjs';
import { createConnection } from 'typeorm';
require('dotenv').config();
export default class DbConnect {
  static config: any = config.get('postgres');

  static connectDB(): Observable<any> {
    return Observable.create(async (observer: Subscriber<any>) => {
      try {
        const connection = await createConnection({ ...this.config });
        console.log('connection to database ok');
        observer.next(connection);
      } catch (error) {
        console.log('Error', error);
        observer.error(error);
      } finally {
        observer.complete();
      }
    });
  }
}
