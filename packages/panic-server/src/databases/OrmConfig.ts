import { ConnectionOptions } from 'typeorm';
require('dotenv').config();
export const connectionOpts: ConnectionOptions = {
  name: 'default',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [`src/models/*.ts`],
  migrations: ['src/databases/migrations/*.ts'],
  synchronize: true,
  logging: false,
  ssl: false,
  cli: {
    migrationsDir: 'src/databases/migrations',
  },
};
