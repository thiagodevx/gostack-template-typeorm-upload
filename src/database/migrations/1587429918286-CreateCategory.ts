import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';

const tableInfo: TableOptions = {
  name: 'categories',
  columns: [
    {
      name: 'id',
      type: 'uuid',
      isPrimary: true,
      generationStrategy: 'uuid',
      default: 'uuid_generate_v4()',
    },
    {
      name: 'title',
      type: 'varchar',
    },
    {
      name: 'created_at',
      type: 'timestamp',
      default: 'now()',
    },
    {
      name: 'updated_at',
      type: 'timestamp',
      default: 'now()',
    },
  ],
};

export default class CreateCategory1587429918286 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table(tableInfo));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableInfo.name);
  }
}
