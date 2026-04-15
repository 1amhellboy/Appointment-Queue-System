import express from "express";
import dotenv from "dotenv";
import connectDB from './src/config/db.js';
import authRoutes from "./src/routes/authRoutes.js";


dotenv.config();

const app = express();

app.use(express.json());

connectDB();



app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("MONGO_URI:", process.env.MONGO_URI);
});