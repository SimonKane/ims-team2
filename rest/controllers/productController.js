import express from "express";
import mongoose from "mongoose";
import { Product } from "../../models/Product.js";

const app = express();
app.use(express.json());

export async function getAllProducts(_req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(`Could not get products. Error: ${error}`);
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(`Could not get product. Error: ${error}`);
  }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(`Could not create product. Error: ${error}`);
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const input = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(`Could not update product. Error: ${error}`);
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.status(200).json(`Deleted ${deletedProduct.name}`);
  } catch (error) {
    res.status(500).json(`Could not delete product. Error: ${error}`);
  }
}

export async function getLowStock(_req, res) {
  try {
    const lowStock = await Product.find({ amountInStock: { $lte: 10 } });
    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json(`Could not get products. Error: ${error}`);
  }
}

export async function getAllManufacturers(_req, res) {
  try {
    const manufacturers = await Product.distinct("manufacturer");
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json(`Can not get manufacturers. Error: ${error}`);
  }
}
