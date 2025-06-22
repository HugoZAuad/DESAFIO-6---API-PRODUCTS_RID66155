import { Router } from "express";
import { StockController } from "../controllers/StockController";

const stockRoutes = Router();
const stockController = new StockController();

stockRoutes.get("/", stockController.list);

export default stockRoutes ;
