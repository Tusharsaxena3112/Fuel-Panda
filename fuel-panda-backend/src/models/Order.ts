import mongoose, { Schema, Document } from "mongoose";

export interface IOrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  sourceType: "hub" | "terminal";
  sourceId: mongoose.Types.ObjectId;

  destinationType: "hub" | "terminal";
  destinationId: mongoose.Types.ObjectId;

  assignedDriverId?: mongoose.Types.ObjectId;
  products: IOrderProduct[];

  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    sourceType: {
      type: String,
      enum: ["hub", "terminal"],
      required: true,
    },
    sourceId: {
      type: Schema.Types.ObjectId,
      refPath: "sourceType",
      required: true,
    },

    destinationType: {
      type: String,
      enum: ["hub", "terminal"],
      required: true,
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      refPath: "destinationType",
      required: true,
    },

    assignedDriverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
