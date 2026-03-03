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

const shouldDebugDbConfig =
  process.env.DEBUG_DB_CONFIG === '1' ||
  process.env.DEBUG_DB_CONFIG?.toLowerCase() === 'true';

if (shouldDebugDbConfig) {
  const sanitizedOptions = {
    ...dataSourceOptions,
    password: dataSourceOptions.password ? '***' : dataSourceOptions.password,
  };

  console.log('[db] DataSource config:', sanitizedOptions);
}

export default new DataSource(dataSourceOptions);
