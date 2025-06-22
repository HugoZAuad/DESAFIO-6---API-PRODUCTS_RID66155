import customerRoutes from "@modules/customers/infra/http/routes/CustomerRoutes";
import ordersRouter from "@modules/orders/infra/http/routes/OrderRoutes";
import productsRouter from "@modules/products/infra/http/routes/ProductRoutes";
import { salesRouter } from "@modules/sales/infra/http/routes/SalesRoutes";
import  stockRouter  from "@modules/stock/infra/http/routes/StockRoutes";
import { Router } from "express";

const routes = Router();

routes.use('/products', productsRouter);
routes.use('/customers', customerRoutes);
routes.use('/orders', ordersRouter);
routes.use('/sales', salesRouter);
routes.use('/stock', stockRouter);

export default routes;
