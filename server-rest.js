import express from "express";
import dotenv from "dotenv";
import { routes } from './routes.js';

dotenv.config();
app.use(express.json());

// Routes 
app.use('/api', routes);

const PORT = 3000;

app.listen(PORT,() =>{
  console.log(`Server is running on ${PORT}`);
});