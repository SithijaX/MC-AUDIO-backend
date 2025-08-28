import express from "express";
import { addInquiry, viewInquiries } from "../controllers/inquiryControler.js";

const inquiryRouter = express.Router();


inquiryRouter.post("/add", addInquiry);
inquiryRouter.get("/list", viewInquiries);

export default inquiryRouter;