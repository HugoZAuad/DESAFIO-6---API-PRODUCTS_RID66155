import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSales1750622558531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sales",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "order_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "sales",
      new TableForeignKey({
        columnNames: ["order_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "orders",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("sales");
    const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("order_id") !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey("sales", foreignKey);
    }
    await queryRunner.dropTable("sales");
  }
}
