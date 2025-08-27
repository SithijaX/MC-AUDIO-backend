import express from "express";
import { userRegistration, userLogin } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/login", userLogin);




export default userRouter;