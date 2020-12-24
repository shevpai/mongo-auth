import { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: [{ type: String, ref: 'Role', required: true }],
});

export const User = model<IUser>('User', userSchema);
