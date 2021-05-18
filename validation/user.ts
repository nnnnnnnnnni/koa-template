import { IValidation } from "interface/validation";
import Joi from "joi";

export const userValidation: {[key: string]: IValidation} = {
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }
}
