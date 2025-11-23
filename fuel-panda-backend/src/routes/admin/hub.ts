import { Router } from "express";
import * as HubController from "../../controllers/hub";

const router = Router();

router.post("/", HubController.createHub);
router.get("/", HubController.getHubs);
router.get("/:id", HubController.getHubById);
router.put("/:id", HubController.updateHub);
router.delete("/:id", HubController.deleteHub);

export default router;
