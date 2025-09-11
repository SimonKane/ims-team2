import mongoose from "mongoose";
import { Product } from "../../models/Product.js";

export async function checkId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const isProduct = await Product.findById(id);
  if (!isProduct) {
    return res.status(400).json({ error: "ID not found" });
  }

  next();
  return;
}
