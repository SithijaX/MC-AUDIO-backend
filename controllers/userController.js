import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const userRegistration = async (req, res) => {
  const { username, firstName, lastName, email, password, age, profileImage, role } = req.body;

  //check if user already exists
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists 👤👎" });
  }


  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //creating user
  try {
    const newUser = new User({ username,role, firstName, lastName, email, password: hashedPassword, age, profileImage });
    await newUser.save();
    res.status(201).json({ message: "User created successfully 👤👍", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user 👤👎", error: error.message });
  }
};


export async function userLogin(req, res) {
  const { email, password } = req.body;

  try {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found 👤👎" });
    }

    //check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "wrong password.. try again!" });
    }

    //create jwt token
    const token = jwt.sign({
                email: user.email,
                password: user.password,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }, process.env.jwtSecret, {expiresIn: '1h'});

    res.status(200).json({ message: "Login successful 👤👍",
        user: { name: user.username, email: user.email, role: user.role }, token });
    } catch (error) {
        res.status(500).json({ message: "🚫 Login failed!", error: error.message });
    }
}