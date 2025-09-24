import express from "express";
import {
  getAllManufacturers,
  getManufacturerById,
} from "../controllers/manufacturerController.js";

const router = express.Router();
router.get("/manufacturers", getAllManufacturers);
router.get("/manufacturers/:id", getManufacturerById);

export default router;
