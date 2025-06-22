import { Product } from "@modules/products/infra/database/entities/Product";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, Column, JoinColumn } from "typeorm";

export enum StockMovementType {
  IN = "IN",
  OUT = "OUT"
}

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int')
  quantity: number;

  @Column()
  product_name: string;

  @Column({
    type: "enum",
    enum: StockMovementType
  })
  movement_type: StockMovementType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
