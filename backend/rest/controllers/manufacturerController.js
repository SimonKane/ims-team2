import express from "express";
import { Manufacturer, Product } from "../../models/models.js";

const app = express();
app.use(express.json());

export async function getAllManufacturers(_req, res) {
  try {
    const manufacturers = await Manufacturer.find().populate({
      path: "contact",
    });
    res.status(200).json(manufacturers);
  } catch (error) {
    res.status(500).json(`Can not get manufacturers. Error: ${error}`);
  }
}

export async function getProductsByManufacturer(req, res) {
  try {
    const { id } = req.params;
    const manufacturer = await Manufacturer.findById(id).populate({
      path: "contact",
    });
    if (!manufacturer) {
      return res.status(404).json("Manufacturer not found");
    }
    const products = await Product.find({ manufacturer: manufacturer.id });

    res.status(200).json({ manufacturer, products });
  } catch (error) {
    res.status(500).json(`Can not get products. Error: ${error}`);
  }
}

//---- POST som kan användas för att skapa ny Manufacturer, används inte för tillfället -------//
// export async function createManufacturer(req, res) {
//   const { manufacturerInput } = req.body;
//   try {
//     const existingManufacturer = await Manufacturer.find({
//       name: manufacturerInput.name,
//     });
//     if (existingManufacturer.length > 0) {
//       return res.status(409).send("Manufacturer already exist");
//     }
//     const createdManufacturer = await Manufacturer.create(manufacturerInput);

//     if (!createdManufacturer) {
//       return res.status(404).json({ error: "Manufacturer not created" });
//     }

//     return res
//       .status(201)
//       .json({ message: "Manufacturer added", createdManufacturer });
//   } catch (error) {
//     res.status(500).json(`Internal server error: ${error}`);
//   }
// }
