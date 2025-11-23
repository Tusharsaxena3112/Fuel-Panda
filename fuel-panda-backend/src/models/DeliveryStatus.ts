import mongoose, { Schema, Document } from "mongoose";

export interface IDeliveryStatus extends Document {
  orderId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  shiftId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  status: "COMPLETED" | "FAILED";
  reason?: string;
}

const DeliveryStatusSchema = new Schema<IDeliveryStatus>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    shiftId: { type: Schema.Types.ObjectId, ref: "Shift", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },

    status: {
      type: String,
      enum: ["COMPLETED", "FAILED"],
      required: true,
    },

    reason: { type: String },
  },
  { timestamps: true }
);

// Prevent duplicate submissions
DeliveryStatusSchema.index(
  { orderId: 1, productId: 1, shiftId: 1 },
  { unique: true }
);

export default mongoose.model<IDeliveryStatus>(
  "DeliveryStatus",
  DeliveryStatusSchema
);
