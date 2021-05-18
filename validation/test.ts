import { IValidation } from "interface/validation";
import Joi from "joi";

export default{
  test: {
    query: {
      name: Joi.string().required(),
      age: Joi.number().required()
    }
  }
} as {[key: string]: IValidation}
