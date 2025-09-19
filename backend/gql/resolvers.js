import { Manufacturer, Product } from "../models/models.js";

export const resolvers = {
  Query: {
    //Query som hämtar alla products och ger även nästlade manufacturers och dess contact
    products: async (_p, { limit }) => {
      return Product.find()
        .limit(limit)
        .populate({
          path: "manufacturer",
          populate: { path: "contact" },
        });
    },

    //Query som hämtar enstaka products och ger även nästlade manufacturers och dess contact
    product: async (_p, { id }) => {
      return Product.findById(id).populate({
        path: "manufacturer",
        populate: { path: "contact" },
      });
    },

    //Query som hämtar ut alla products med ett amountInStock under ett dynamiskt satt värde som per default är satt på 100
    getLowStock: async (_p, { threshold }) => {
      const items = await Product.find({ amountInStock: { $lte: threshold } });
      return { items, message: items.length ? "OK" : "NO LOW STOCK" };
    },

    //Samma query som ovan men default threshold är satt på 10 och då returnerar contact till manufacturer för beställning av nya products
    getCriticalStock: async (_p, { threshold }) => {
      const items = await Product.find({ amountInStock: { $lte: threshold } });
      return { items, message: items.length ? "OK" : "NO CRITICAL STOCK" };
    },

    //Query som ger till backa totala värdet på alla produkter i lager
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

    //Query som returnerar alla manufacturers som vi seedat till 10 stycken
    getAllManufacturers: async (_p) => {
      const allManufacturers = await Manufacturer.find().populate({
        path: "contact",
      });
      return allManufacturers;
    },

    //Query som kollar hur många producter en manufacturer har och summerar alla producters värde per manufacturer
    //Använder aggregate och pipeline
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

      return result;
    },
  },
  Mutation: {
    //Vi har valt att inte lägga in funktion som skapar manufacturer eller contact då man väljer av redan existerande från lista om man skapar product i frontend

    //Skapar product med en av existerande manufacturers id. manufacturerID behövs som input, man behöver fylla i all info om manufacturer
    addProduct: async (_p, { productInput }) => {
      const { manufacturerId, ...product } = productInput;
      const createdProduct = await Product.create({
        ...product,
        manufacturer: manufacturerId,
      });
      return createdProduct;
    },

    //Updaterar product, man kan även byta manufacturer via manufacturerId
    updateProduct: async (_p, { id, updateInput }) => {
      const updatedProduct = await Product.findByIdAndUpdate(id, updateInput, {
        new: true,
        runValidatiors: true,
      });
      return updatedProduct;
    },

    //Raderar product
    deleteProduct: async (_p, { id }) => {
      const deletedProduct = await Product.findByIdAndDelete(id);
      return {
        deleted_product: deletedProduct,
        message: "Deleted sucessfully",
      };
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
