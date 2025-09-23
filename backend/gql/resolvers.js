import { Manufacturer, Product } from "../models/models.js";

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
      return deletedProduct;
    },
  },
};

//TODO Implementera nedan

// import { GraphQLError } from "graphql";
// import { Contact, Manufacturer } from "../models/models.js";

// export const resolvers = {
//   Mutation: {
//     addManufacturer: async (_p, { input }) => {
//       try {
//         // 1. skapa kontakt först
//         const contact = await Contact.create(input.contact);

//         // 2. skapa manufacturer kopplad till kontakten
//         const manufacturer = await Manufacturer.create({
//           ...input,
//           contact: contact._id,
//         });

//         return manufacturer;
//       } catch (err) {
//         if (err.name === "ValidationError") {
//           // Mongoose valideringsfel → gör om till GraphQLError
//           throw new GraphQLError("Invalid input", {
//             extensions: {
//               code: "BAD_USER_INPUT",
//               errors: Object.keys(err.errors).map((field) => ({
//                 field,
//                 message: err.errors[field].message,
//               })),
//             },
//           });
//         }
//         throw err; // andra fel bubbla upp
//       }
//     },
//   },

//   Manufacturer: {
//     id: (doc) => String(doc._id),
//     contact: (doc) => Contact.findById(doc.contact).exec(),
//     createdAt: (doc) => doc.createdAt.toISOString(),
//     updatedAt: (doc) => doc.updatedAt.toISOString(),
//   },

//   Contact: {
//     id: (doc) => String(doc._id),
//     createdAt: (doc) => doc.createdAt.toISOString(),
//     updatedAt: (doc) => doc.updatedAt.toISOString(),
//   },
// };
