import express from "express";
import { Contact } from "../../models/Contact.js";

const app = express();
app.use(express.json());

export async function createContact(req, res) {
  const { name, email, phone } = req.body;
  try {
    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json("Kan inte skapa kontakt");
  }
}
