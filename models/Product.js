// model
import mongoose from "mongoose";
import { Manufacturer } from "./Manufacturer";

const product = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    manufacturer: Manufacturer,
    amountInStock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "products" }
);

export const Product = mongoose.model("Product", product);
