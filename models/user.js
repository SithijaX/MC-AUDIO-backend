import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profileImage: { type: String, required: true, default: "" },
  firstName:    { type: String, required: true },
  lastName:     { type: String, required: true },
  username:     { type: String, required: true, unique: true },
  email:        { type: String, required: true, unique: true },
  password:     { type: String, required: true },
  age:          { type: Number, required: true },
  role:         { type: String, required: true, enum: ["user", "admin"], default: "user" }
});

const User = mongoose.model("User", userSchema);

export default User;