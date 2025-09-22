import express from "express";
import { Contact, Manufacturer, Product } from "../../models/models.js";

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

    // const products = await Product.find(filter.search)
    //   .limit(limit)
    //   .populate({ path: "manufacturer", select: "name" })
    //   .lean()
    //   .sort({ name: 1 });

    // return res.status(200).json(products);

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
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json(`Could not get product. Error: ${error}`);
  }
}
//TODO Ändra så man endast gör en produkt och lägger in manufacturerId

export async function createProduct(req, res) {
  const { contactInput, manufacturerInput, productInput } = req.body;
  const existingManufacturer = await Manufacturer.find({
    name: manufacturerInput.name,
  });

  if (existingManufacturer.length > 0) {
    try {
      productInput.manufacturer = existingManufacturer._id;
      const product = await Product.create(productInput);
      return res.status(201).json(product);
    } catch (error) {
      res.status(500).json(`Could not create product. Error: ${error}`);
    }
  } else {
    try {
      const contact = await Contact.create(contactInput);
      manufacturerInput.contact = contact._id;
      const manufacturer = await Manufacturer.create(manufacturerInput);
      productInput.manufacturer = manufacturer._id;
      const product = await Product.create(productInput);
      return res.status(201).json(product);
    } catch (error) {
      res.status(500).json(`Could not create product. Error: ${error}`);
    }
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
