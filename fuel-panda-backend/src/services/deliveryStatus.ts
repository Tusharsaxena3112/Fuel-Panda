import DeliveryStatus from "../models/DeliveryStatus";
import Order from "../models/Order";
import Hub from "../models/Hub";
import Terminal from "../models/Terminal";
import Shift from "../models/Shift";
import VehicleAllocation from "../models/VehicleAllocation";
import { DeliveryUpdateDTO } from "../types/deliveryStatus";

export const updateDeliveryStatus = async (
  driverId: string,
  shiftId: string,
  dto: DeliveryUpdateDTO
) => {
  const { orderId, status, reason } = dto;

  const shift = await Shift.findOne({ _id: shiftId, driverId, active: true });
  if (!shift) throw new Error("No active shift found for driver");

  const allocation = await VehicleAllocation.findById(shift.allocationId);
  if (!allocation) throw new Error("Allocation not found for this shift");

  if (!allocation.orders.some((id) => id.toString() === orderId)) {
    throw new Error("Order does not belong to this shift");
  }

  const existingStatus = await DeliveryStatus.findOne({ orderId });

  if (existingStatus?.status === "COMPLETED") {
    return existingStatus; 
  }

  if (existingStatus?.status === "FAILED" && status === "COMPLETED") {
    throw new Error("Order already marked as failed. Cannot mark completed.");
  }

  const record = await DeliveryStatus.findOneAndUpdate(
    { orderId },
    { orderId, driverId, shiftId, status, reason },
    { upsert: true, new: true }
  );

  if (status === "COMPLETED") {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    const DestinationModel = order.destinationType === "hub" ? Hub : Terminal;
    const destination = await DestinationModel.findById(order.destinationId);
    if (!destination) throw new Error("Destination not found");

    if (!Array.isArray((destination as any).inventory)) {
      (destination as any).inventory = [];
    }

    for (const item of order.products) {
      const idx = (destination as any).inventory.findIndex(
        (inv: any) => inv.productId.toString() === item.productId.toString()
      );

      if (idx === -1) {
        (destination as any).inventory.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      } else {
        (destination as any).inventory[idx].quantity += item.quantity;
      }
    }

    await destination.save();

    await Order.findByIdAndUpdate(orderId, { status: "COMPLETE" });
  }

  if (status === "FAILED") {
    await Order.findByIdAndUpdate(orderId, { status: "FAILED" });
  }

  return record;
};
