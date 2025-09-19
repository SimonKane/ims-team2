import mongoose from "mongoose";

//Tre separata collections som är kopplade via ID-referenser.

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
  },
  { timestamps: true, collection: "contacts" }
);

export const Contact = mongoose.model("Contact", contactSchema);

const manufacturerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
  },
  { timestamps: true, collection: "manufacturers" }
);

export const Manufacturer = mongoose.model("Manufacturer", manufacturerSchema);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, unique: true, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "Manufacturer" },
    amountInStock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, collection: "products" }
);

export const Product = mongoose.model("Product", productSchema);
