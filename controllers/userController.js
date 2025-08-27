import User from "../models/user.js";
import bcrypt from "bcrypt";

export const userRegistration = async (req, res) => {
  const { username, firstName, lastName, email, password, age, profileImage } = req.body;

  //check if user already exists
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists 👤👎" });
  }


  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //creating user
  try {
    const newUser = new User({ username, firstName, lastName, email, password: hashedPassword, age, profileImage });
    await newUser.save();
    res.status(201).json({ message: "User created successfully 👤👍", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user 👤👎", error: error.message });
  }
};
