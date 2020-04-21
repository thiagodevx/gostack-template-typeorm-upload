import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { TableOptions } from 'typeorm/schema-builder/options/TableOptions';
import { TableForeignKeyOptions } from 'typeorm/schema-builder/options/TableForeignKeyOptions';

const tableInfo: TableOptions = {
  name: 'transactions',
  columns: [
    {
      name: 'id',
      type: 'uuid',
      isPrimary: true,
      generationStrategy: 'uuid',
      default: 'uuid_generate_v4()',
    },
    {
      name: 'category_id',
      type: 'uuid',
      isNullable: true,
    },
    {
      name: 'title',
      type: 'varchar',
    },
    {
      name: 'value',
      type: 'real',
    },
    {
      name: 'type',
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
const newColumnForeignKeyOptions: TableForeignKeyOptions = {
  columnNames: ['category_id'],
  referencedColumnNames: ['id'],
  referencedTableName: 'categories',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
  name: 'fk_category_id',
};
const newForeignKey: TableForeignKey = new TableForeignKey(
  newColumnForeignKeyOptions,
);

export default class CreateTransaction1587430104887
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table(tableInfo));
    await queryRunner.createForeignKey(tableInfo.name, newForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(tableInfo.name, newForeignKey);
    await queryRunner.dropTable(tableInfo.name);
  }
}
