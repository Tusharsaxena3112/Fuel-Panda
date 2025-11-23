import { Request, Response } from "express";
import * as DeliveryService from "../services/deliveryStatus";
import { DeliveryUpdateDTO } from "../types/deliveryStatus";

export const updateDeliveryHandler = async (req: Request, res: Response) => {
  try {
    // In a real app driverId should be from auth; for now accept from body or query
    const driverId = req.body.driverId || req.query.driverId;
    const shiftId = req.body.shiftId || req.query.shiftId;
    if (!driverId || !shiftId) return res.status(400).json({ message: "driverId and shiftId required" });

    const dto: DeliveryUpdateDTO = req.body;
    const result = await DeliveryService.updateDeliveryStatus(driverId, shiftId, dto);
    res.json({ ok: true, data: result });
  } catch (err: any) {
    res.status(400).json({ ok: false, message: err.message });
  }
};
