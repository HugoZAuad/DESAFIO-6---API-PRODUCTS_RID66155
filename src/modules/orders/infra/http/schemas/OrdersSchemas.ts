import { celebrate, Joi, Segments } from "celebrate";

export const isParamsValidate = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
});

export const createOrderValidate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    customer_id: Joi.string().required(),
    products: Joi.array().items(
      Joi.object().keys({
        product_id: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    ).required(),
  }),
});
