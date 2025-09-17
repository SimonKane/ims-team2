import { Product } from "../models/models.js";
import {
  getLowStock,
  updateProduct,
} from "../rest/controllers/productController.js";

// resolvers
export const resolvers = {
  Query: {
    products: async (_p, { limit }) => {
      //TODO Lägg till validering för att limit ej ska vara null

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
      return Product.find({ amountInStock: { $lte: threshold } });
    },
    getCriticalStock: async (_p, { threshold }) => {
      const items = await Product.find({ amountInStock: { $lte: 2 } });
      return { items, message: items.length ? "OK" : "NO CRITICAL STOCK" };
    },
  },
  Mutation: {
    //Istället för att hårdkoda en nästlad manufacturer
    addProduct: async (_p, { productInput }) => {
      const { manufacturerId, ...product } = productInput;
      const createdProduct = await Product.create({
        ...product,
        manufacturer: manufacturerId,
      });
      return createdProduct;
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
      return {
        deleted_product: deletedProduct,
        message: "Deleted sucessfully",
      };
    },
  },
};

// om contact inte finns på ett objekt, vad händer när man gör en query och enbart vill ha contact som retur
