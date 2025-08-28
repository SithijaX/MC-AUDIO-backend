import express from "express";
import { addReview, viewReviews, editReview, approveReviews } from "../controllers/reviewController.js";

const reviewRouter = express.Router();


reviewRouter.post("/add", addReview);
reviewRouter.get("/reviews", viewReviews);
reviewRouter.put("/edit/:email", editReview);
reviewRouter.put("/approve/:email", approveReviews);


export default reviewRouter;