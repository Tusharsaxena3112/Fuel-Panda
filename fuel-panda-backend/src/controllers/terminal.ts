import { Request, Response } from "express";
import * as TerminalService from "../services/terminal";
import { CreateTerminalDTO, TerminalFilters, UpdateTerminalDTO } from "../types/terminal";

export const createTerminal = async (
  req: Request<{}, {}, CreateTerminalDTO>,
  res: Response
) => {
  try {
    const terminal = await TerminalService.createTerminal(req.body);
    res.status(201).json(terminal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTerminals = async (
  req: Request<{}, {}, {}, TerminalFilters>,
  res: Response
) => {
  try {
    const terminals = await TerminalService.getTerminals(req.query);
    res.json(terminals);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getTerminalById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const terminal = await TerminalService.getTerminalById(req.params.id);
    if (!terminal) return res.status(404).json({ message: "Terminal not found" });
    res.json(terminal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTerminal = async (
  req: Request<{ id: string }, {}, UpdateTerminalDTO>,
  res: Response
) => {
  try {
    const terminal = await TerminalService.updateTerminal(req.params.id, req.body);
    if (!terminal) return res.status(404).json({ message: "Terminal not found" });
    res.json(terminal);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTerminal = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    await TerminalService.deleteTerminal(req.params.id);
    res.json({ message: "Terminal deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
