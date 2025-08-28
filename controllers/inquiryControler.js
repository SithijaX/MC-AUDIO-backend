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
        data.response = "";
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

export async function viewInquiries(req,res) {
    if(!req.user) {
        return res.status(403).json({message: "Plase login and try again!"});
    }  

    if(!(req.user.role === "admin")) {
        return res.status(403).json({message: "Admins only!"});
    }

    try {
        const inquiries = await Inquiry.find().sort({date: -1});

        res.status(200).json({
        message: "Inquiries fetched successfully",inquiries,});
    } 
    catch(error) {
        res.status(500).json({message: error.message});
    }
}

export async function giveResForInquiry(req, res) {
  if (!req.user) {
    return res.status(403).json({ message: "Please log in and try again!" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only!" });
  }

  try {
    const { response } = req.body;
    const id = Number(req.params.id);

    const replyingInquiry = await Inquiry.findOneAndUpdate(
      { id },
      { 
        $set: { 
          response, 
          respondedDate: new Date()   // ✅ set timestamp
        } 
      },
      { new: true }   // return updated doc
    );

    if (!replyingInquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json({
      message: "Response added successfully 👍",
      inquiry: replyingInquiry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

