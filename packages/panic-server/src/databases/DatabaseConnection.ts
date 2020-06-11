import config from 'config';
import { Observable, Subscriber } from 'rxjs';
import { createConnection } from 'typeorm';

export default class DbConnect {
  config: any = config.get('database');

  connectDB(): Observable<any> {

    const isDevMode = process.env.NODE_ENV === 'development';

    return Observable.create(async (observer: Subscriber<any>) => {
      try {

        const connection = await createConnection({
          ...this.config,
          type: 'postgres',
          entities: [...(isDevMode ? ['src/models/**/*.ts'] : ['dist/models/**/*.js'])],
          synchronize: true,
          logging: false,
          ssl: false,
          cli: {
            migrationsDir: 'src/databases/migrations',
          },
        });

        console.log('connection to database ok');
        observer.next(connection);
      } catch (error) {
        console.log('Error *******************', error);
        observer.error(error);
      } finally {
        observer.complete();
      }
    });
  }
}
