import { Manufacturer, Product } from "../models/models.js";

export const resolvers = {
  Query: {
    products: async (_p, { limit }) => {
      return Product.find()
        .limit(limit)
        .populate({
          path: "manufacturer",
          populate: { path: "contact" },
        });
    },

    product: async (_p, { id }) => {
      return Product.findById(id).populate({
        path: "manufacturer",
        populate: { path: "contact" },
      });
    },

    getLowStock: async (_p, { threshold }) => {
      const items = await Product.find({ amountInStock: { $lte: threshold } });
      return { items, message: items.length ? "OK" : "NO LOW STOCK" };
    },

    getCriticalStock: async (_p, { threshold }) => {
      const items = await Product.find({ amountInStock: { $lte: threshold } });
      return { items, message: items.length ? "OK" : "NO CRITICAL STOCK" };
    },

    totalStockValue: async () => {
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

      return totalValue;
    },

    getAllManufacturers: async (_p) => {
      const allManufacturers = await Manufacturer.find().populate({
        path: "contact",
      });
      return allManufacturers;
    },

    totalStockValueByManufacturer: async (_p) => {
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
        {
          $unwind: "$manufacturer",
        },
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
      console.log(result);
      return result;
    },
  },

  Mutation: {
    addProduct: async (_p, { productInput }) => {
      try {
        const { manufacturerId, ...product } = productInput;

        const manufacturer = await Manufacturer.findById(manufacturerId);
        if (!manufacturer) {
          throw new Error("Manufacturer not found");
        }

        const createdProduct = await Product.create({
          ...product,
          manufacturer: manufacturerId,
        });

        return createdProduct;
      } catch (err) {
        if (err.code === 11000) {
          throw new Error("SKU already exists, please use a unique one");
        }
        throw err;
      }
    },

    updateProduct: async (_p, { id, updateInput }) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateInput, {
        new: true,
        runValidatiors: true,
      });
      return updatedProduct;
    },

    deleteProduct: async (_p, { id }) => {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return deletedProduct;
    },
  },
};
