import { Router } from "express";
import * as ProductController from "../../controllers/product";
import { authAdminStub } from "../../middlewares/authAdminStub";
const router = Router();

router.post("/", authAdminStub, ProductController.createProduct);
router.get("/", authAdminStub, ProductController.getProducts);
router.get("/:id", authAdminStub, ProductController.getProductById);
router.put("/:id", authAdminStub, ProductController.updateProduct);
router.delete("/:id", authAdminStub, ProductController.deleteProduct);

export default router;
