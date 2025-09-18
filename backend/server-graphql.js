import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { validationResult } from "express-validator";
import { ApolloServer } from "@apollo/server";

import { typeDefs } from "./gql/typeDefs.js";
import { resolvers } from "./gql/resolvers.js";
import { expressMiddleware } from "@as-integrations/express5";
import { createProductValidator } from "./rest/middleware/validators/productValidator.js";
import { createManufacturerValidator } from "./rest/middleware/validators/manufacturorValidator.js";
import { createContactValidator } from "./rest/middleware/validators/contactValidator.js";

dotenv.config();

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());

//Starta apollo server
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

/*-- Validators---*/

const validators = {
  createContact: createContactValidator,
  addManufacturer: createManufacturerValidator,
  addProduct: createProductValidator,
};

app.use("/graphql", async (req, res, next) => {
  const query = req.body?.query || "";

  // hitta matchande mutationsnamn i validators-objektet
  for (const mutationName of Object.keys(validators)) {
    if (query.includes(mutationName)) {
      for (const step of validators[mutationName]) {
        await step.run(req);
      }

      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({
          errors: result.array().map((e) => ({
            message: e.msg,
            field: e.param,
            location: e.location,
          })),
        });
      }
      break;
    }
  }

  next();
});

/*------ */

// app.use(
//   "/graphql",
//   expressMiddleware(apollo, {
//     context: async () => ({}),
//   })
// );

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Running on port 3000");
    });
  })
  .catch(console.error);
