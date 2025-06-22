import { celebrate, Joi, Segments } from "celebrate";

export const createSaleValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    order_id: Joi.number().integer().required(),
    products: Joi.array().items(
      Joi.object().keys({
        stock_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    ).required(),
  }),
});
