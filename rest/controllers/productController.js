import express from "express";
import { Product } from "../../models/Product.js";

const app = express();
app.use(express.json());

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json("Kan inte skapa produkt");
  }
}
