import config from 'config';
import { Observable, Subscriber } from 'rxjs';
import { ConnectionOptions, createConnection } from 'typeorm';
require('dotenv').config();
export default class DbConnect {
  static connectionOpts: ConnectionOptions = {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [`src/models/*.ts`],
    synchronize: true,
    logging: false,
    ssl: false,
  };
  static config: any = config.get('postgres');

  static connectDB(): Observable<any> {
    return Observable.create(async (observer: Subscriber<any>) => {
      try {
        const connection = await createConnection(this.connectionOpts);
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
