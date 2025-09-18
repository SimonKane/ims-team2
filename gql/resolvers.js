import { GraphQLError } from "graphql";
import { Contact, Manufacturer } from "../models/models.js";

export const resolvers = {
  Mutation: {
    addManufacturer: async (_p, { input }) => {
      try {
        // 1. skapa kontakt först
        const contact = await Contact.create(input.contact);

        // 2. skapa manufacturer kopplad till kontakten
        const manufacturer = await Manufacturer.create({
          ...input,
          contact: contact._id,
        });

        return manufacturer;
      } catch (err) {
        if (err.name === "ValidationError") {
          // Mongoose valideringsfel → gör om till GraphQLError
          throw new GraphQLError("Invalid input", {
            extensions: {
              code: "BAD_USER_INPUT",
              errors: Object.keys(err.errors).map((field) => ({
                field,
                message: err.errors[field].message,
              })),
            },
          });
        }
        throw err; // andra fel bubbla upp
      }
    },
  },

  Manufacturer: {
    id: (doc) => String(doc._id),
    contact: (doc) => Contact.findById(doc.contact).exec(),
    createdAt: (doc) => doc.createdAt.toISOString(),
    updatedAt: (doc) => doc.updatedAt.toISOString(),
  },

  Contact: {
    id: (doc) => String(doc._id),
    createdAt: (doc) => doc.createdAt.toISOString(),
    updatedAt: (doc) => doc.updatedAt.toISOString(),
  },
};
