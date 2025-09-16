import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import { ApolloServer } from "@apollo/server";
import { Contact, Manufacturer, Product } from "./models/models.js";
import { typeDefs } from "./gql/typeDefs.js";

dotenv.config();

const app = express();

app.use(express.json());
