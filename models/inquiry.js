import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true
    },
    phone: {
        type: String,
        required : true
    },
    message:{
        type: String,
        required: true
    },
    response:{
        type: String,
        required: false,
        default: ""
    }
});

const Inquiry = new mongoose.model("Inquiry", inquirySchema);
export default Inquiry;