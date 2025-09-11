import express from "express";
import { Product } from "../../models/Product.js";

const app = express();
app.use(express.json());

export async function getAllProducts(_req, res) {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(`Can not get products. Error: ${error}`);
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(`Can not get product. Error: ${error}`);
  }
}

export async function getAllManufacturers(_req, res) {
  try {
    const manufacturers = await Product.distinct("manufacturer.name");
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json(`Can not get manufacturers. Error: ${error}`);
  }
}

export async function createProduct(req, res) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json(`Can not create product. Error: ${error}`);
  }
}


export async function totalStockValue(_req, res) {
  try {
    const products = await Product.find();
    const totalValue = products.reduce((acc, product) => {
      return acc + product.price * product.amountInStock;
    }, 0);

    return res.status(200).json({ totalValue });
  } catch (error) {
    return res.status(500).json({ message: "Cannot calculate total stock value", error });
  }
}