import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateSalesStock1750622600550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "sales_stock",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "sale_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "stock_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quantity",
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
      "sales_stock",
      new TableForeignKey({
        columnNames: ["sale_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "sales",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "sales_stock",
      new TableForeignKey({
        columnNames: ["stock_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "stock",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("sales_stock");

    const saleForeignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("sale_id") !== -1);
    if (saleForeignKey) {
      await queryRunner.dropForeignKey("sales_stock", saleForeignKey);
    }

    const stockForeignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("stock_id") !== -1);
    if (stockForeignKey) {
      await queryRunner.dropForeignKey("sales_stock", stockForeignKey);
    }

    await queryRunner.dropTable("sales_stock");
  }
}
