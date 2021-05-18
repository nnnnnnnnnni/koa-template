import Joi from "joi";

export interface IValidationField {
  [key: string]: Joi.Schema
}

export interface IValidation {
  body?: IValidationField;
  query?: IValidationField,
  params?: IValidationField
}