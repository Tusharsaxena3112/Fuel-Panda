import { Request, Response } from "express";
import * as HubService from "../services/hub";
import { CreateHubDTO, HubFilters, UpdateHubDTO } from "../types/hub";

export const createHub = async (
  req: Request<{}, {}, CreateHubDTO>,
  res: Response
) => {
  try {
    const hub = await HubService.createHub(req.body);
    res.status(201).json(hub);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getHubs = async (
  req: Request<{}, {}, {}, HubFilters>,
  res: Response
) => {
  try {
    const hubs = await HubService.getHubs(req.query);
    res.json(hubs);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getHubById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const hub = await HubService.getHubById(req.params.id);
    if (!hub) return res.status(404).json({ message: "Hub not found" });
    res.json(hub);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateHub = async (
  req: Request<{ id: string }, {}, UpdateHubDTO>,
  res: Response
) => {
  try {
    const hub = await HubService.updateHub(req.params.id, req.body);
    if (!hub) return res.status(404).json({ message: "Hub not found" });
    res.json(hub);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteHub = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await HubService.deleteHub(req.params.id);
    res.json({ message: "Hub deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
