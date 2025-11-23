import mongoose, { Schema, Document } from "mongoose";

export interface IVehicleAllocation extends Document {
  driverId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD
  orders: mongoose.Types.ObjectId[]; 
}

const VehicleAllocationSchema = new Schema<IVehicleAllocation>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    date: { type: String, required: true },

    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// One driver cannot have multiple allocations on the same date
VehicleAllocationSchema.index({ driverId: 1, date: 1 }, { unique: true });

// One vehicle cannot have multiple allocations on the same date
VehicleAllocationSchema.index({ vehicleId: 1, date: 1 }, { unique: true });

export default mongoose.model<IVehicleAllocation>(
  "VehicleAllocation",
  VehicleAllocationSchema
);
