import express from "express";
import mongoose from "mongoose";
import Dotenv from "dotenv";

Dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected successfully 😘");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });



  //import userRoutes
  import userRouter from "./routes/userRouter.js";


  //Routing
  app.use("/api/user", userRouter);

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port} 😎`);
});