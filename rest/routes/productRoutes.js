import express from "express";
import { createProduct } from "../controllers/productController.js";
import { getAllProducts } from "../controllers/productController.js";
import { getProductById } from "../controllers/productController.js";
import { getAllManufacturers } from "../controllers/productController.js";

const router = express.Router();

router.get("/manufacturers", getAllManufacturers);
router.get("/:id", getProductById);
router.get("/", getAllProducts);
router.post("/create", createProduct);
export default router;
