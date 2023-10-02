import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1696263324858 implements MigrationInterface {
  name = 'Migrations1696263324858';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "migrations" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "migrations" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "migrations" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "migrations" DROP COLUMN "createdAt"`);
  }
}
