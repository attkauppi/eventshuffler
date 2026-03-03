import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitEvent1772573165032 implements MigrationInterface {
  name = 'InitEvent1772573165032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(
      `CREATE TABLE "${schema}"."event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const schema =
      (queryRunner.connection.options as { schema?: string }).schema ??
      'public';

    await queryRunner.query(`DROP TABLE "${schema}"."event"`);
  }
}
