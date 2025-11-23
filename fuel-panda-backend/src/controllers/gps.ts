import { Request, Response } from "express";
import * as GpsService from "../services/gps";
import { SendGpsDTO } from "../types/gps";

export const postGps = async (req: Request, res: Response) => {
  try {
    const dto: SendGpsDTO = req.body;
    // in real application driverId comes from auth token; here accept from body
    if (!dto.driverId || dto.lat === undefined || dto.lng === undefined) {
      return res.status(400).json({ message: "driverId, lat, lng are required" });
    }

    const rec = await GpsService.storeGps(dto);
    res.status(201).json(rec);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getFleetActive = async (req: Request, res: Response) => {
  try {
    const data = await GpsService.getLiveTracking();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const getVehicleHistory = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const filters = req.query as any;
    const data = await GpsService.getVehicleHistory(vehicleId, filters);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getVehicleLast = async (req: Request, res: Response) => {
  try {
    const { vehicleId } = req.params;
    const data = await GpsService.getVehicleLastLocation(vehicleId);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
