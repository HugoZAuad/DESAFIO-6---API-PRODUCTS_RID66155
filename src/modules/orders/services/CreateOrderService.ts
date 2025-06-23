import AppError from "@shared/errors/AppError";
import { Order } from "@modules/orders/infra/database/entities/Orders";
import { ISaveOrder } from "@modules/orders/domains/interfaces/ISaveOrder";
import { IProductRepositories } from "@modules/products/domains/repositories/ICreateProductRepositories";
import { ICustomerRepositories } from "@modules/customers/domains/repositories/ICreateCustomerRepositories";
import { IOrderRepositories } from "@modules/orders/domains/repositories/ICreateOrderRepositories";
import { injectable, inject } from "tsyringe";

@injectable()
export class CreateOrderService {
  constructor(
    @inject('productRepositories')
    private readonly productRepositories: IProductRepositories,
    @inject('customerRepositories')
    private readonly customerRepositories: ICustomerRepositories,
    @inject('orderRepositories')
    private readonly orderRepositories: IOrderRepositories
  ) {}

  async execute({ customer_id, order_products }: ISaveOrder): Promise<Order> {
    if (!customer_id) {
      throw new AppError("customer_id é obrigatório para criar um pedido");
    }

    const customerExists = await this.customerRepositories.findById(Number(customer_id));

    if (!customerExists) {
      throw new AppError("O cliente não foi localizado", 404);
    }

    const existsProducts = await this.productRepositories.findAllByIds(
      order_products.map(product => Number(product.product_id))
    );

    if (!existsProducts.length) {
      throw new AppError("Não foi possível encontrar os produtos solicitados", 404);
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkInexistentProducts = order_products.filter(
      product => !existsProductsIds.includes(Number(product.product_id))
    );

    if (checkInexistentProducts.length) {
      throw new AppError(`Produto ${checkInexistentProducts[0].product_id} não encontrado`, 404);
    }

    const quantityAvailable = order_products.filter(product => {
      const productData = existsProducts.find(p => p.id === Number(product.product_id));
      return productData && productData.quantity < product.quantity;
    });

    if (quantityAvailable.length) {
      throw new AppError(`A quantidade não está disponível para o produto`, 409);
    }

    const orderProductsWithPrice = order_products.map(product => {
      const productData = existsProducts.find(p => p.id === Number(product.product_id));
      return {
        product_id: product.product_id,
        quantity: product.quantity,
        price: productData ? productData.price : 0,
      };
    });

    const order = await this.orderRepositories.create({
      customer_id: customerExists.id.toString(),
      customer: customerExists,
      order_products: orderProductsWithPrice,
    });

    const updateProductQuantity = order.order_products.map(product => {
      const productData = existsProducts.find(p => p.id === Number(product.product_id));
      return {
        id: Number(product.product_id),
        quantity: productData ? productData.quantity - product.quantity : 0,
      };
    });

    for (const product of updateProductQuantity) {
      const productData = existsProducts.find(p => p.id === product.id);
      await this.productRepositories.save({
        id: product.id,
        name: productData?.name || '',
        price: productData?.price || 0,
        quantity: product.quantity,
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    return order;
  }
}
