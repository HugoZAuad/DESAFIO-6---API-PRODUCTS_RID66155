import { Router } from "express";
import { StockController } from "../controllers/StockController";

const stockRouter = Router();
const stockController = new StockController();

stockRouter.post("/", stockController.create);

export { stockRouter };
