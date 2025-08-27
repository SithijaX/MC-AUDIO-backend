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
    token = token.replace("Bearer", "");
    console.log(token);

    jwt.verify(token, process.env.jwtSecret, (err, decode) => {
      if(err) {
        console.log(decoded);
        return res.status(401).json({
          message : "Unauthorized access! "
        })
      }

      req.user = decoded;
      console.log(req.user);
      next();
    })
  } else {
    next();
  }

}
);

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