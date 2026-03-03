import 'dotenv/config';
import { DataSource, type DataSourceOptions } from 'typeorm';

import { Event } from '../event/entities/event.entity';

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5588),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: process.env.DATABASE_SCHEMA ?? 'public',
  entities: [Event],
  migrations: ['src/db/migrations/*{.ts,.js}'],
  synchronize: false,
};

export default new DataSource(dataSourceOptions);
