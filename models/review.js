import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    email       :   {require: true, type: String, unique: true},
    name        :   {type: String, require: true},
    profileImage:   { type: String, required: true },
    comment     :   {type: String, require: true},
    date        :   {type: Date, default: Date.now},
    isApproved  :   {type: Boolean, default: false}
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;