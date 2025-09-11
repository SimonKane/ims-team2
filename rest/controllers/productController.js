import express from "express";
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

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, input, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(`Could not update product. Error: ${error}`);
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;

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

export async function totalStockValue(_req, res) {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$price", "$amountInStock"] } },
        },
      },
    ]);
    const totalValue = result.length > 0 ? result[0].totalValue : 0;
    res.status(200).json({ totalStockValue: totalValue });
  } catch (error) {
    console.error("Error calculating total stock value:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function totalStockValueByManufacturer(_req, res) {
  try {
    const result = await Product.aggregate([
      { $match: { amountInStock: { $gt: 0 } } },
      {
        $group: {
          _id: "$manufacturer.name",
          totalValue: { $sum: { $multiply: ["$price", "$amountInStock"] } },
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating total stock value:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
