import express from "express";
import * as AllocationController from "../../controllers/vehicleAllocation";
import { authAdminStub } from "../../middlewares/authAdminStub";

const router = express.Router();

router.post("/", authAdminStub, AllocationController.createAllocation);
router.get("/", authAdminStub, AllocationController.getAllocations);
router.get("/:id", authAdminStub, AllocationController.getAllocationById);
router.put("/:id", authAdminStub, AllocationController.updateAllocation);
router.delete("/:id", authAdminStub, AllocationController.deleteAllocation);

export default router;
