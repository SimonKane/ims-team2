import express from "express";
import dotenv from "dotenv";
import productRoutes from "./rest/routes/productRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

dotenv.config();
app.use(express.json());

// Routes
app.use("/product", productRoutes);

const PORT = process.env.PORT;

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    })
  )
  .catch(console.error);
