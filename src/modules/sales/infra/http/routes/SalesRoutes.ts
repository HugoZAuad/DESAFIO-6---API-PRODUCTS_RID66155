import { Router } from "express";
import { SalesController } from "../controllers/SalesController";
import { createSaleValidate } from "../schemas/SalesSchemas";

const salesRouter = Router();
const salesController = new SalesController();

salesRouter.post("/", createSaleValidate, salesController.create);
salesRouter.get("/", salesController.list);

export { salesRouter };
