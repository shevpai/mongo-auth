import { Schema, Document, model } from 'mongoose';

export interface IRole extends Document {
  value: string;
}

const userRole = new Schema({
  value: { type: String, unique: true, required: true, default: 'USER' },
});

export const Role = model<IRole>('Role', userRole);
