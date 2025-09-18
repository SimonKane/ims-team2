import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

import { createContactValidator } from "./rest/middleware/validators/contactValidator.js";
import { createManufacturerValidator } from "./rest/middleware/validators/manufacturersValidator.js";
import { createProductValidator } from "./rest/middleware/validators/productValidator.js";

import { typeDefs } from "./gql/typeDefs.js";
import { resolvers } from "./gql/resolvers.js";

dotenv.config();

const app = express();
app.use(express.json());

/* ------------------------
   1. Connect to MongoDB
------------------------ */
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("2No MongoDB connection string found in .env (MONGODB_URI missing)");
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("MongoDB connection error:", err.message);
  process.exit(1);
}

/* ------------------------
   2. Validators
------------------------ */
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

/* ------------------------
   3. Apollo Server
------------------------ */
const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
app.use("/graphql", expressMiddleware(server));

/* ------------------------
   4. Start Express
------------------------ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}/graphql`)
);
