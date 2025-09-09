// model
import mongoose from "mongoose";


const contactSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    phone: {type: String, required: true, trim: true},
  }
);

const manufacturer = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    country: {type: String, required: true, trim: true},
    website: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    address: {type: String, required: true, trim: true},
    contact: contactSchema,
   }
);

const product = new mongoose.Schema(
  {
    name: {type : String, required: true, trim: true},
    sku: {type: String, unique: true, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    price: {type: Number, required: true, min: 0},
    category: {type: String, required: true, trim: true},
    manufacturer: manufacturer,
    amountInStock: {type: Number, required: true, min: 0},
  }
);


export const Product = mongoose.model("Product", product);