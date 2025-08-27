import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemCode : {type: String, require: true, unique: true},
    itemName : {type: String, require: true},
    itemPic  : {type: String, require: true, default:"" },
    rentPrice: {type: Number, require: true, default: 0},
    category : {type: String, require: true, default:"other", enum:["audio", "light", "other"]},
    availability: { type: Boolean, require: true, default: true }

});

const Item = mongoose.model("Item", itemSchema);

export default Item;

  