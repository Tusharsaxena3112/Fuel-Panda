import { Request, Response } from "express";
import * as allocationService from "../services/vehicleAllocation";

export const createAllocation = async (req: Request, res: Response) => {
  try {
    const allocation = await allocationService.createAllocation(req.body);
    res.status(201).json(allocation);
  } catch (error) {
    res.status(400).json({ message: "Failed to create allocation", error });
  }
};

export const getAllocations = async (req: Request, res: Response) => {
  try {
    const allocations = await allocationService.getAllocations(req.query as any);
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch allocations", error });
  }
};

export const getAllocationById = async (req: Request, res: Response) => {
  try {
    const allocation = await allocationService.getAllocationById(req.params.id);
    if (!allocation) return res.status(404).json({ message: "Not found" });
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch allocation", error });
  }
};

export const updateAllocation = async (req: Request, res: Response) => {
  try {
    const allocation = await allocationService.updateAllocation(
      req.params.id,
      req.body
    );
    res.json(allocation);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error });
  }
};

export const deleteAllocation = async (req: Request, res: Response) => {
  try {
    await allocationService.deleteAllocation(req.params.id);
    res.json({ message: "Allocation deleted" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error });
  }
};
