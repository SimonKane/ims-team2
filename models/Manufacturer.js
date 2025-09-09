import mongoose from "mongoose";
import { Contact } from "./Contact";

const manufacturer = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: Contact,
  },
  { timestamps: true, collection: "manufacturers" }
);

export const Manufacturer = mongoose.model("Manufacturer", manufacturer);
