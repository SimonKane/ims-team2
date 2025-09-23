import express from "express";
import {
  getAllManufacturers,
  getProductsByManufacturer,
} from "../controllers/manufacturerController.js";

const router = express.Router();
router.get("/manufacturers/:id", getProductsByManufacturer);
router.get("/manufacturers", getAllManufacturers);

export default router;
