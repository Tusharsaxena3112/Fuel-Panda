import mongoose, { Schema, Document } from "mongoose";

export interface IHub extends Document {
  name: string;
  location: { lat: number; lng: number };
  inventory: [{producId: mongoose.Types.ObjectId, quantity: number}];
}

const HubSchema: Schema = new Schema<IHub>(
  {
    name: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    inventory: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IHub>("Hub", HubSchema);
