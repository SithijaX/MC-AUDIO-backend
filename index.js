import express from "express";
import mongoose from "mongoose";
import Dotenv from "dotenv";

Dotenv.config();

const app = express();

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully 😘");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port} 😎`);
});