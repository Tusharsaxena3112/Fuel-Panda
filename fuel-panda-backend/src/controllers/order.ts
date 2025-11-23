import { Request, Response } from "express";
import * as OrderService from "../services/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const result = await OrderService.getOrders(req.query as any);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const updated = await OrderService.updateOrder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Order not found" });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await OrderService.deleteOrder(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
