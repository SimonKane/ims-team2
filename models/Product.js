// model
import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const manufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: contactSchema,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    manufacturer: { type: manufacturerSchema, required: true },
    amountInStock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "products" }
);

export const Product = mongoose.model("Product", productSchema);
