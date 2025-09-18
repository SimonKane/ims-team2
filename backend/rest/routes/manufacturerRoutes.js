import express from "express";
import { getAllManufacturers } from "../controllers/manufacturerController.js";

const router = express.Router();
router.get("/manufacturers", getAllManufacturers);

export default router;
