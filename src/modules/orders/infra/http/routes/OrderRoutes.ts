import { Router } from 'express'
import OrdersControllers from '../controllers/OrdersControllers'
import { createOrderValidate, isParamsValidate } from '../schemas/OrdersSchemas'

const ordersRouter = Router()
const orderControllers = new OrdersControllers()

ordersRouter.get('/:id', isParamsValidate, orderControllers.show)
ordersRouter.post('/', createOrderValidate, orderControllers.create)

export default ordersRouter
