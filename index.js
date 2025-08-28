import express from "express";
import mongoose from "mongoose";
import Dotenv from "dotenv";
import jwt from 'jsonwebtoken';

Dotenv.config();

const app = express();
app.use(express.json());


//token checking middleware
app.use((req, res, next) => {
  let token = req.header("Authorization");

  if (token) {

    token = token.replace("Bearer ", "").trim();

    jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
      if (err) {
        console.error("JWT Error:", err.message);
        return res.status(401).json({
          message: "Unauthorized access! Invalid or expired token."
        });
      }

      // Attach decoded user info to request
      req.user = decoded;
      console.log("Authenticated User:", req.user);

      next();
    });
  } else {
    // No token
    next();
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: error.message });
});



mongoose.connect(process.env.mongoURL)
  .then(() => {
    console.log("MongoDB connected successfully 😘");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });



  //import Routes
  import userRouter from "./routes/userRouter.js";
  import itemRouter from "./routes/itemRouter.js";
  import reviewRouter from "./routes/reviewRouter.js";
  import inquiryRouter from "./routes/inquiryRouter.js";


  //Routing
  app.use("/api/user", userRouter);
  app.use("/api/item", itemRouter);
  app.use("/api/review", reviewRouter);
  app.use("/api/inquiry", inquiryRouter);

app.listen(process.env.port, () => {
  console.log(`Server is running on port ${process.env.port} 😎`);
});