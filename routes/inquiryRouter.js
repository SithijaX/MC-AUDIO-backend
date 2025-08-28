import express from "express";
import { addInquiry, deleteInquiry, giveResForInquiry, viewInquiries } from "../controllers/inquiryControler.js";

const inquiryRouter = express.Router();


inquiryRouter.post("/add", addInquiry);
inquiryRouter.get("/list", viewInquiries);
inquiryRouter.put("/respondForInquiry/:id", giveResForInquiry);
inquiryRouter.delete("/delete/:id", deleteInquiry);

export default inquiryRouter;