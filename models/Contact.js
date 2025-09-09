import mongoose from "mongoose";

const contact = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
  },
  { timestamps: true, collection: "contacts" }
);

export const Contact = mongoose.model("Contact", contact);
