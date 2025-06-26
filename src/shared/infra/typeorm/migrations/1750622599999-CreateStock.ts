import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStock1750622599999 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "stock",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "product_id",
            type: "int",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "int",
            isNullable: false,
          },
          {
            name: "product_name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "movement_type",
            type: "enum",
            enum: ["IN", "OUT"],
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
      "stock",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("stock");
    const foreignKey = table!.foreignKeys.find(fk => fk.columnNames.indexOf("product_id") !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey("stock", foreignKey);
    }
    await queryRunner.dropTable("stock");
  }
}
