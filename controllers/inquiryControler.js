import Inquiry from "../models/inquiry.js";

export async function addInquiry(req,res) {
    if(!req.user) {
        return res.status(403).json({message: "Plase login and try again!"});
    }    
    try {
        const data = req.body;

        const lastInquiry = await Inquiry.findOne().sort({ id: -1 });
        const id = lastInquiry ? lastInquiry.id + 1 : 1;

        data.email = req.user.email;
        data.phone = req.user.phone;
        data.id = id;

        const newInquiry = new Inquiry (data);
        const savedInquiry = await newInquiry.save();
        
        res.status(201).json(
            {
                message: "Inquiry submitted successfully 👍",
                inquiry: savedInquiry
            });
    

        }
        catch (error) {
            res.status(500).json({message: error.message});
    }
}