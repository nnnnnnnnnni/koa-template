import mongoose from 'mongoose'
import {IUserSchema} from './model'
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  secret: String,
  lastLogin: {
    type: Date,
    default: new Date()
  },
}, {
  timestamps: {
    createdAt: 'createAt',
    updatedAt: 'updateAt'
  }
})

export default mongoose.model<IUserSchema>('user', userSchema)