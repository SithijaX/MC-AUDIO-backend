import express from "express";
import { userRegistration, userLogin, userList, updateUser, deleteUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", userRegistration);
userRouter.post("/login", userLogin);
userRouter.get("/list", userList);
userRouter.put("/update/:email", updateUser);
userRouter.delete("/delete/:email", deleteUser);

export default userRouter;