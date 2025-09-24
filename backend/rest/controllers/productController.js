import express from "express";
import { Product } from "../../models/models.js";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

export async function getAllProducts(req, res) {
  const regExSearch = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const { limit, search } = req.query;

    const filter = {};
    if (search) {
      filter.search = { name: { $regex: regExSearch(search), $options: "i" } };
    }

    const pipeline = [
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturer",
        },
      },
      { $unwind: "$manufacturer" },
      {
        $lookup: {
          from: "contacts",
          localField: "manufacturer.contact",
          foreignField: "_id",
          as: "contact",
        },
      },
      { $set: { "manufacturer.contact": { $first: "$contact" } } },
      { $unset: "contact" },
      { $sort: { "manufacturer.name": 1 } },
    ];
    const docs = await Product.aggregate(pipeline);

    return res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.isValidObjectId(manufacturerId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function createProduct(req, res) {
  try {
    const { productInput, manufacturerId } = req.body;

    if (!productInput || !manufacturerId) {
      return res
        .status(400)
        .json({ error: "Product info and manufacturer ID needed" });
    }

    if (!mongoose.isValidObjectId(manufacturerId)) {
      return res.status(400).json({ error: "Invalid manufacturer ID" });
    }
    const createdProduct = await Product.create({
      ...productInput,
      manufacturer: manufacturerId,
    });
    res.status(201).json({
      message: "Product created",
      product: createdProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "Product already exists" });
    }
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function updateProduct(req, res) {
  const { id } = req.params;
  const input = req.body;

  //<------id validation med middleware----->

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, input, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product to update not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.params;
  //<------id validation med middleware----->
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      res.status(404).json({ error: "Could not find product to delete" });
    }

    res.status(200).json({ product_deleted: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getLowStock(_req, res) {
  try {
    const lowStockProducts = await Product.find({
      amountInStock: { $lte: 100 },
    });

    if (lowStockProducts.lenght === 0) {
      res
        .status(404)
        .json({ message: "No products with critical stock found" });
    }

    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function getCriticalStock(_req, res) {
  try {
    const products = await Product.find({
      amountInStock: { $lte: 10 },
    })
      .populate({
        path: "manufacturer",
        select: { name: 1, _id: 0 },
        populate: {
          path: "contact",
          model: "Contact",
          select: "name email phone",
        },
      })
      .select({
        name: 1,
        _id: 0,
        amountInStock: 1,
      });
    //Kommer alltid returnera status 200 då man får en tom array om inga products finns
    if (products.length === 0) {
      res
        .status(200)
        .json({ message: "No products with critical stock found", products });
    }
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function totalStockValue(_req, res) {
  try {
    const [result] = await Product.aggregate([
      { $match: { amountInStock: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ["$price", "$amountInStock"] } },
        },
      },
    ]);

    //Ungefärlig felhantering med optional chaining
    const totalValue = result?.totalValue ?? 0;

    res.status(200).json({ totalStockValue: totalValue });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
}

export async function totalStockValueByManufacturer(_req, res) {
  try {
    const pipeline = [
      { $match: { amountInStock: { $gt: 0 } } },
      {
        $lookup: {
          from: "manufacturers",
          localField: "manufacturer",
          foreignField: "_id",
          as: "manufacturer",
        },
      },
      { $unwind: "$manufacturer" },
      {
        $group: {
          _id: "$manufacturer.name",
          totalStockValue: {
            $sum: { $multiply: ["$price", "$amountInStock"] },
          },
        },
      },
      { $project: { manufacturer: "$_id", totalStockValue: 1, _id: 0 } },
    ];
    const result = await Product.aggregate(pipeline);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error calculating total stock value:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
}
