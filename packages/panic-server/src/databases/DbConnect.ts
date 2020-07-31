import config from 'config';

import { createConnection } from 'typeorm';

export default class DbConnect {
  config: any = config.get('database');
  // options: any = config.get('options');
  async start() {
    await this.connectDB();
  }
  async connectDB(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const isDevMode = process.env.NODE_ENV === 'development';
        const isTestMode = process.env.NODE_ENV === 'test';
        const connection = await createConnection({
          ...this.config,
          type: 'mysql',
          entities: [
            ...(isDevMode || isTestMode
              ? ['src/models/**/*.ts']
              : ['dist/models/**/*.js']),
          ],
          synchronize: true,
          logging: false,
          ssl: false,
          cli: {
            migrationsDir: 'src/databases/migrations',
          },
        });

        console.log('connection to database ok');
        resolve(connection);
      } catch (error) {
        console.log('Error', error);
        reject(error);
      } finally {
        resolve();
      }
    });
  }
}
