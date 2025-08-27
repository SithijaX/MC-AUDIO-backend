import express from "express";
import { userRegistration } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistration);




export default userRouter;