import mongoose from "mongoose";
import { Product, Contact, Manufacturer } from "../models/models.js";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "ims" });
    await Promise.all([
      Product.deleteMany({}),
      Contact.deleteMany({}),
      Manufacturer.deleteMany({}),
    ]);

    // Skapa 10 manufacturers
    const manuDocs = Array.from({ length: 10 }).map(() => ({
      name: faker.company.name(),
      country: faker.location.country(),
      website: faker.internet.url(),
      description: faker.company.catchPhrase(),
      address: faker.location.streetAddress(),
    }));
    const manufacturers = await Manufacturer.insertMany(manuDocs);

    // Skapa 1 contact per manufacturer
    const contactsToCreate = manufacturers.map((m) => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      manufacturer: m._id,
    }));
    const contacts = await Contact.insertMany(contactsToCreate);

    // Koppla contacts till respektive manufacturer
    const manuBulk = manufacturers.map((m, i) => {
      const contactId = contacts[i]._id;
      return {
        updateOne: {
          filter: { _id: m._id },
          update: { $set: { contacts: [contactId], contact: contactId } },
        },
      };
    });
    if (manuBulk.length) {
      await Manufacturer.bulkWrite(manuBulk);
    }

    // Skapa 200 products, slumpmässigt tilldelade någon av de 10 manufacturers
    const manuIds = manufacturers.map((m) => m._id);
    const usedSkus = new Set();
    function uniqueSku() {
      while (true) {
        const sku =
          "SKU-" + faker.string.alphanumeric({ length: 8 }).toUpperCase();
        if (!usedSkus.has(sku)) {
          usedSkus.add(sku);
          return sku;
        }
      }
    }
    const productDocs = Array.from({ length: 200 }).map(() => ({
      name: faker.commerce.productName(),
      sku: uniqueSku(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.commerce.department(),
      amountInStock: faker.number.int({ min: 0, max: 500 }),
      manufacturer: faker.helpers.arrayElement(manuIds),
    }));

    await Product.insertMany(productDocs);
    console.log("Seeded database completed");
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

seedDatabase();
