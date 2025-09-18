import express from "express";
import dotenv from "dotenv";
import productRoutes from "./rest/routes/productRoutes.js";
import manufacturerRoutes from "./rest/routes/manufacturerRoutes.js";
import { connectDB } from "./config/db.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", productRoutes);
app.use("/api", manufacturerRoutes);

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    })
  )
  .catch(console.error);
