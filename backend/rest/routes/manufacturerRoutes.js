import express from "express";
import {
  getAllManufacturers,
  getProductsByManufacturer,
  getManufacturerById,
} from "../controllers/manufacturerController.js";

const router = express.Router();
router.get("/manufacturers", getAllManufacturers);
router.get("/manufacturers/:id", getManufacturerById);
router.get("/manufacturers/products/:id", getProductsByManufacturer);
export default router;
