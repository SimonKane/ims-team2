import express from "express";
import dotenv from "dotenv";
import contactRoutes from "./rest/routes/contactRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();

dotenv.config();
app.use(express.json());

// Routes
app.use("/contacts", contactRoutes);

const PORT = process.env.PORT;

connectDB()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    })
  )
  .catch(console.error);
