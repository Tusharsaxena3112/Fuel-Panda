import { Router } from "express";

import * as TerminalController from '../../controllers/terminal';

const router = Router();

router.post('/', TerminalController.createTerminal);
router.get("/", TerminalController.getTerminals);
router.get("/:id", TerminalController.getTerminalById);
router.put("/:id", TerminalController.updateTerminal);
router.delete("/:id", TerminalController.deleteTerminal);

export default router;
