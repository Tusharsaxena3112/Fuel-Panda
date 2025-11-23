import Order, { IOrder } from "../models/Order";
import { CreateOrderDTO, UpdateOrderDTO, OrderFilters } from "../types/order";

export const createOrder = async (data: CreateOrderDTO): Promise<IOrder> => {
  return await Order.create(data);
};

export const getOrders = async (filters: OrderFilters): Promise<IOrder[]> => {
  const { page = 1, limit = 20, search, driverId, status } = filters;

  const query: any = {};

  if (driverId) query.assignedDriverId = driverId;
  if (status) query.status = status;

  if (search) {
    query.$or = [
      { destinationType: { $regex: search, $options: "i" } },
      //TODO: search product names? later we can populate & match
    ];
  }

  return Order.find(query)
    .populate("assignedDriverId")
    .populate("products.productId")
    .skip((page - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });
};

export const getOrderById = async (id: string): Promise<IOrder | null> => {
  return Order.findById(id)
    .populate("assignedDriverId")
    .populate("products.productId");
};

export const updateOrder = async (
  id: string,
  data: UpdateOrderDTO
): Promise<IOrder | null> => {
  return Order.findByIdAndUpdate(id, data, { new: true });
};

export const deleteOrder = async (id: string): Promise<void> => {
  await Order.findByIdAndDelete(id);
};
