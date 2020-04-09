import { MigrationInterface, QueryRunner } from 'typeorm';

export class HistoryRefactoring1586435620898 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "history" RENAME COLUMN "uptime" TO "uptime_value"`
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "history" RENAME COLUMN "uptime_value" TO "uptime"`
    );
  }
}
