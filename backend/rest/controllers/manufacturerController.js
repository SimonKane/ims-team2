import express from "express";
import { Manufacturer } from "../../models/models.js";

const app = express();
app.use(express.json());

//----ONÖDIG POST MEN DEN FINNS HÄR I NÖDFALL-------//

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
/*---------------------------------------------------------------------------- */

//För att hämta alla manufacturers och displaya när man lägger till en product så man kan välja fårn lista

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
