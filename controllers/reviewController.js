import Review from "../models/review.js";

export async function addReview(req,res) {
    if(!(req.user)) {
        return res.status(401).json({message: "Please login and continue! "});
    }
    try {

        const data = req.body;

        data.email = req.user.email;
        data.name = req.user.username;
        data.profileImage = req.user.profileImage;
        data.isApproved = false;
        
        const newReview = new Review(data);
        const savedReview = await newReview.save();

        if (!savedReview) {
            res.status(500).json({message: "there was an error while saving !"});
        }
        res.status(201).json({
            message: "Review added successfully",
            isApproved: savedReview.isApproved            
        })
    } catch (error)
    {
        res.status(500).json({message: "Internal server error! ", error : error.message})
    }
}