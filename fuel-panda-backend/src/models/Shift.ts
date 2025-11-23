import mongoose, { Schema, Document, Types } from "mongoose";

export interface IShift extends Document {
  allocationId: Types.ObjectId;
  driverId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  startedAt?: Date;
  endedAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema = new Schema<IShift>(
  {
    allocationId: { type: Schema.Types.ObjectId, ref: "VehicleAllocation", required: true, unique: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    date: { type: String, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Ensure one shift per allocation (one shift per order allocation)
ShiftSchema.index({ allocationId: 1 }, { unique: true });
ShiftSchema.index({ driverId: 1, date: 1 });

export default mongoose.model<IShift>("Shift", ShiftSchema);
