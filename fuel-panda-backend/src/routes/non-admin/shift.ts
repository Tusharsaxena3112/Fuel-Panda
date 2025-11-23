import { Router } from "express";
import * as ShiftCtrl from "../../controllers/shift";
const router = Router();

router.post("/", ShiftCtrl.createShiftHandler); 
router.post("/:shiftId/start", ShiftCtrl.startShiftHandler);
router.post("/:shiftId/end", ShiftCtrl.endShiftHandler); 
router.get("/:driverId", ShiftCtrl.getAllShiftHandler); 
router.get("/", ShiftCtrl.getAllShifts);

export default router;
