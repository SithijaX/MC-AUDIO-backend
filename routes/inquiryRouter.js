import express from "express";
import { addInquiry, giveResForInquiry, viewInquiries } from "../controllers/inquiryControler.js";

const inquiryRouter = express.Router();


inquiryRouter.post("/add", addInquiry);
inquiryRouter.get("/list", viewInquiries);
inquiryRouter.put("/respondForInquiry/:id", giveResForInquiry);

export default inquiryRouter;