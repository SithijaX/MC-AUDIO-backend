import express from "express";
import { addInquiry } from "../controllers/inquiryControler.js";

const inquiryRouter = express.Router();


inquiryRouter.post("/add", addInquiry);


export default inquiryRouter;