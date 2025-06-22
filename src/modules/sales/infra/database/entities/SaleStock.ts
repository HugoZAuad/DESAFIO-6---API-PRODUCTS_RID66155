import { Sale } from "@modules/sales/infra/database/entities/Sale";
import { Stock } from "@modules/stock/infra/database/entities/Stock";
import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('sales_stock')
export class SaleStock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, sale => sale.sale_stocks)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @ManyToOne(() => Stock)
  @JoinColumn({ name: 'stock_id' })
  stock: Stock;

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
