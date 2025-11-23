import { Request, Response } from "express";
import * as ShiftService from "../services/shift";

export const createShiftHandler = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const shift = await ShiftService.createShift(payload);
    res.status(201).json(shift);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const startShiftHandler = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const driverId = req.body.driverId; // in future use auth
    const shift = await ShiftService.startShift(shiftId, driverId);
    res.json(shift);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const endShiftHandler = async (req: Request, res: Response) => {
  try {
    const { shiftId } = req.params;
    const driverId = req.body.driverId;
    const shift = await ShiftService.endShift(shiftId, driverId);
    res.json(shift);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllShiftHandler = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const shift = await ShiftService.getAllShiftForDriver(driverId);
    res.json(shift);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};



export const getAllShifts = async (req: Request, res: Response) => {
  try {
    const shift = await ShiftService.getAllShifts();
    res.json(shift);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};