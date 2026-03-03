import { config as loadEnv } from 'dotenv';
import { DataSource } from 'typeorm';

import { InitEvent1772573165032 } from '../src/db/migrations/1772573165032-init_event';
import { Event } from '../src/event/entities/event.entity';

describe('Database behavior (e2e)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    loadEnv({ path: '.env.test' });

    dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: Number(process.env.DATABASE_PORT ?? 5588),
      username: process.env.DATABASE_USER ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
      database: process.env.DATABASE_NAME ?? 'eventshuffle',
      schema: process.env.DATABASE_SCHEMA ?? 'test',
      entities: [Event],
      migrations: [InitEvent1772573165032],
      synchronize: false,
    });

    await dataSource.initialize();
    await dataSource.runMigrations();
  });

  beforeEach(async () => {
    await dataSource.getRepository(Event).clear();
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('successfully connects to database', async () => {
    const rows: { ok: number }[] = await dataSource.query('SELECT 1 AS ok');
    expect(rows[0].ok).toBe(1);
  });

  it('creates event table from migrations', async () => {
    const rows: { table_exists: boolean }[] = await dataSource.query(
      `select exists (
        select 1
        from information_schema.tables
        where table_schema = $1
        and table_name = 'event'
      ) as table_exists`,
      [process.env.DATABASE_SCHEMA ?? 'test'],
    );
    expect(rows[0].table_exists).toBe(true);
  });

  it('persists and reads Event entity', async () => {
    const repo = dataSource.getRepository(Event);

    const created = await repo.save(
      repo.create({
        name: 'Event',
      }),
    );

    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeInstanceOf(Date);

    const found = await repo.findOneByOrFail({ id: created.id });
    expect(found.name).toBe('Event');
  });
});
