import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import { ApolloServer } from "@apollo/server";

import { typeDefs } from "./gql/typeDefs.js";
import { resolvers } from "./gql/resolvers.js";
import { expressMiddleware } from "@as-integrations/express5";

dotenv.config();

const app = express();
const PORT = process.env.port || 3000;

app.use(express.json());

//Starta apollo server
const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

app.use(
  "/graphql",
  expressMiddleware(apollo, {
    context: async () => ({}),
  })
);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Running on port 3000");
    });
  })
  .catch(console.error);
