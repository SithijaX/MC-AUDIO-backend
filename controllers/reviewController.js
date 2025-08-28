import Review from "../models/review.js";

//add reviews
export async function addReview(req,res) {
    if(!(req.user)) {
        return res.status(401).json({message: "Please login and continue! "});
    }

    // 1. Check if user already posted a review
    const existingReview = await Review.findOne({ email: req.user.email });
    if (existingReview) {
        return res.status(400).json({
            message: "You have already posted a review. Only one review is allowed!"
        });
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

//view reviews
export async function viewReviews(req,res) {

    try {

    if (!req.user) {
        return res.status(403).json({message: "please login and try again! "});
    }
    
    let reviews;
    if (req.user.role === "admin") {
        reviews = await Review.find().sort({date: -1});
    } else 
    {
        reviews = await Review.find({isApproved:true}).sort({date: -1});
    }

    return res.status(200).json({reviews:reviews});
        } 
    catch (error) 
    {
        res.status(500).json({ message: "Error fetching reviews 🚫"});
    } 
}

//edit reviews
export async function editReview(req, res) {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Please login and try again! 🚫" });
        }

        const {email} = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required to update a review 😕" });
        }

        if (req.user.email !== email) {
            return res.status(403).json({ message: "Forbidden! You are not allowed to edit this review 🤨" });
        }

        // Only allow specific fields
        const allowedFields = ["comment"];
        const updateFields = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updateFields[field] = req.body[field];
            }
        }

        const updatedReview = await Review.findOneAndUpdate(
            { email },
            updateFields,
            { new: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ message: "Review not found 😢" });
        }

        return res.status(200).json({
            message: "Review updated successfully ❤️",
            comment: updatedReview.comment
        });

    } catch (error) {
        console.error("Error while editing review:", error.message);
        return res.status(500).json({ message: "Internal server error 🚫" });
    }
}


export async function approveReviews(req, res) {
    try {
        // Check login
        if (!req.user) {
            return res.status(403).json({ message: "Please login and try again! 🚫" });
        }

        // Check admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not allowed to approve reviews 🤨🚫" });
        }

        const { email } = req.params;

        // Validate email param
        if (!email) {
            return res.status(400).json({ message: "Email is required to approve a review 😕" });
        }

        // Check if review exists
        const reviewExists = await Review.findOne({ email });
        if (!reviewExists) {
            return res.status(404).json({ message: "Review not found! 😢" });
        }

        // Approve review
        const approvedReview = await Review.findOneAndUpdate(
            { email },
            { isApproved: true },
            { new: true }
        );

        if (!approvedReview) {
            return res.status(500).json({ message: "There was an error while approving the review 🚫" });
        }

        return res.status(200).json({
            message: "Review approved successfully ✅",
            review: approvedReview
        });

    } catch (err) {
        console.error("Error approving review:", err);
        return res.status(500).json({ message: "Internal server error 🚫" });
    }
}


export async function deleteReview(req, res) {
    if (!req.user) {
        return res.status(403).json({ message: "Please login and try again! 🚫" });
    }

    const { email } = req.params;

    // Allow only the owner OR an admin
    if (req.user.email !== email && req.user.role !== "admin") {
        return res.status(403).json({ message: "You are not allowed to delete this review 🤨" });
    }

    try {
        const deletedReview = await Review.findOneAndDelete({ email });

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found 😒" });
        }

        return res.status(200).json({ message: "Review deleted successfully ✅" });

    } catch (error) {
        console.error("Error deleting review:", error);
        return res.status(500).json({ message: "Internal server error 🚫" });
    }
}
