import { OrdersProducts } from "@modules/orders/infra/database/entities/OrdersProducts"

export class IProduct {
  id: number
  order_products: OrdersProducts[] 
  name: string
  price: number
  quantity: number
  created_at: Date
  updated_at: Date

  constructor(data: Omit<IProduct, 'id' | 'created_at' | 'updated_at'>) {
    this.id = Math.floor(Math.random() * 1000)
    this.name = data.name
    this.price = data.price
    this.quantity = data.quantity
    this.created_at = new Date()
    this.updated_at = new Date()
    this.order_products = data.order_products || [];
  }
}
