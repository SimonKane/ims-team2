import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  totalStockValue,
  totalStockValueByManufacturer,
  getLowStock,
  getAllManufacturers,
} from "../controllers/productController.js";

import { checkId } from "../middleware/checkId.js";

const router = express.Router();

router.get("/products/low-stock", getLowStock);
router.get("/products/total-stock-value-by-manufacturer", totalStockValueByManufacturer);
router.get("/products/total-stock-value", totalStockValue);
// router.get("/products/critical-stock")

router.get("/products/:id", checkId, getProductById);
router.put("/products/:id", checkId, updateProduct);
router.delete("/products/:id", checkId, deleteProduct);

router.get("/products", getAllProducts);
router.post("/products", createProduct);

router.get("/manufacturers", getAllManufacturers);

export default router;
