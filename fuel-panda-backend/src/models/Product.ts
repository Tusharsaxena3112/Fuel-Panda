import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  unit: 'gallons' | 'liters'
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    unit: { type: String, enum: ["gallons", "liters"], required: true }
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
