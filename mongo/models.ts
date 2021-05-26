import { Document } from 'mongoose'

export interface IUser {
  avator?: string;
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  secret?: string;
  createAt?: string;
  updateAt?: string;
  lastLogin?: Date;
}

export interface IUserSchema extends IUser, Document { }