import mongoose, { Schema, Document, Types } from "mongoose";

export interface IGpsLocation extends Document {
  driverId: Types.ObjectId;
  vehicleId: Types.ObjectId;
  allocationId?: Types.ObjectId;
  shiftId?: Types.ObjectId;
  lat: number;
  lng: number;
  ts: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GpsSchema = new Schema<IGpsLocation>(
  {
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    allocationId: { type: Schema.Types.ObjectId, ref: "VehicleAllocation" },
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    ts: { type: Date, required: true },
  },
  { timestamps: true }
);

// Indexes for fast retrieval by vehicle and shift (recent first)
GpsSchema.index({ vehicleId: 1, ts: -1 });
GpsSchema.index({ shiftId: 1, ts: -1 });

export default mongoose.model<IGpsLocation>("GpsLocation", GpsSchema);
