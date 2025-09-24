import { Product } from "../../models/models.js";
import mongoose from "mongoose";

export async function getAllProducts(req, res) {
  const regExSearch = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  try {
    const { limit, search } = req.query;

    const matchStage = {};
    if (search) {
      matchStage.name = { $regex: regExSearch(search), $options: "i" };
    }

    const pipeline = [
      ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),
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
      { $sort: { name: 1 } },
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
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(`Could not get product. Error: ${error}`);
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

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, input, {
      new: true,
    });
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

export async function getCriticalStock(_req, res) {
  try {
    const products = await Product.find({
      amountInStock: { $lte: 5 },
    })
      .populate({
        path: "manufacturer",
        select: { name: 1, _id: 1 },
        populate: {
          path: "contact",
          model: "Contact",
          select: "name email phone",
        },
      })
      .select({
        name: 1,
        _id: 1,
        amountInStock: 1,
      });

    if (!products) res.status(404).json({ message: " No products found" });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
}
