import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  plateNumber: string;
  vehicleModel: string;
  capacityGallons: number;
  isActive: boolean;
}

const VehicleSchema: Schema = new Schema<IVehicle>(
  {
    plateNumber: { type: String, required: true, unique: true },
    vehicleModel: { type: String, required: true },
    capacityGallons: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
