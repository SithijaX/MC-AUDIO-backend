import express from "express";

import { addItem, getItems, updateItem, deleteItem } from "../controllers/itemController.js";

const itemRouter = express.Router();

itemRouter.post("/add", addItem);
itemRouter.get("/list", getItems);
itemRouter.put("/update/:itemCode", updateItem);
itemRouter.delete("/delete/:itemCode", deleteItem);

export default itemRouter;
