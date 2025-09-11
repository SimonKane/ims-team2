import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStock,
  getAllManufacturers,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/products/low-stock", getLowStock);

router.get("/products/:id", getProductById);
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// router.get("/products/total-stock-value")
// router.get("/products/total-stock-value-by-manufacturer")
// router.get("/products/critical-stock")
router.get("/manufacturers", getAllManufacturers);

export default router;
