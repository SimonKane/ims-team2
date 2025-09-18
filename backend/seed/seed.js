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

    const manuDocs = Array.from({ length: 20 }).map(() => ({
      name: faker.company.name(),
      country: faker.location.country(),
      website: faker.internet.url(),
      description: faker.company.catchPhrase(),
      address: faker.location.streetAddress(),
    }));
    const manufacturers = await Manufacturer.insertMany(manuDocs);
    const contactsToCreate = [];
    for (const m of manufacturers) {
      const howMany = faker.number.int({ min: 1, max: 3 });
      for (let i = 0; i < howMany; i++) {
        contactsToCreate.push({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          manufacturer: m._id,
        });
      }
    }
    const contacts = await Contact.insertMany(contactsToCreate);

    const contactsByManu = contacts.reduce((acc, c) => {
      const key = c.manufacturer.toString();
      (acc[key] ||= []).push(c._id);
      return acc;
    }, {});

    const manuBulk = manufacturers.map((m) => {
      const list = contactsByManu[m._id.toString()] || [];
      const primary = list.length ? faker.helpers.arrayElement(list) : null;
      return {
        updateOne: {
          filter: { _id: m._id },
          update: { $set: { contacts: list, contact: primary } },
        },
      };
    });
    if (manuBulk.length) {
      await Manufacturer.bulkWrite(manuBulk);
    }
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
    const productDocs = Array.from({ length: 100 }).map(() => ({
      name: faker.commerce.productName(),
      sku: uniqueSku(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price({ min: 10, max: 1000 })),
      category: faker.commerce.department(),
      amountInStock: faker.number.int({ min: 0, max: 500 }),
      manufacturer: faker.helpers.arrayElement(manuIds),
    }));

    await Product.insertMany(productDocs);
    await mongoose.connection.close();
  } catch (error) {
    console.error(error);
    mongoose.connection.close();
  }
}

seedDatabase();
