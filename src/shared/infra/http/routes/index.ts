import customerRoutes from "@modules/customers/infra/http/routes/CustomerRoutes";
import ordersRouter from "@modules/orders/infra/http/routes/OrderRoutes"
import productsRouter from "@modules/products/infra/http/routes/ProductRoutes";
import { Router } from "express";

const routes = Router();

routes.use("/products", productsRouter);
routes.use('/customers', customerRoutes)
routes.use('/orders', ordersRouter)

export default routes;
