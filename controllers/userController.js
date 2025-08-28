import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

export const userRegistration = async (req, res) => {
  const { username, firstName, lastName, email, password, age, profileImage, role, phone } = req.body;

  //check if user already exists
  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists 👤👎" });
  }


  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //creating user
  try {
    const newUser = new User({ username,role, firstName, lastName, email,phone, password: hashedPassword, age, profileImage });
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
                profileImage: user.profileImage,
                email: user.email,
                phone: user.phone,
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


export async function userList(req,res) {
  try {
    if(!(await isAdmin(req,res))) {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users 🚫"});
  }
}


export async function updateUser(req, res) {
  try {
    const { email } = req.params;
    const updates = req.body;

    // Only allow admins OR the actual user to update
    const isUserAdmin = await isAdmin(req);
    if (!(isUserAdmin || req.user.email === email)) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Whitelist fields to prevent privilege escalation
    const allowedFields = ["firstName", "lastName", "password", "profileImage", "email"];
    const safeUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key];
      }
    }

    // 🔑 If password is being updated, hash it before saving
    if (safeUpdates.password) {
      const salt = await bcrypt.genSalt(10);
      safeUpdates.password = await bcrypt.hash(safeUpdates.password, salt);
    }

    const user = await User.findOneAndUpdate(
      { email },
      safeUpdates,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found 🚫" });
    }

    // 🚫 Never send password back in response
    const { password, ...userWithoutPassword } = user.toObject();

    res.status(200).json({
      message: "User updated successfully 👤👍",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res.status(500).json({ message: "Error updating user 🚫" });
  }
}


export async function deleteUser(req, res) {
  try {
    const { email } = req.params;

    const isUserAdmin = await isAdmin(req);
    const isSameUser = req.user.email === email;

    // Only admins or the user themselves can delete
    if (!isUserAdmin && !isSameUser) {
      return res.status(403).json({
        message: "You are not allowed to delete this user 😒 !"
      });
    }

    // Optional: prevent admins from deleting themselves
    if (isUserAdmin && isSameUser) {
      return res.status(403).json({
        message: "Admins cannot delete their own account 😎 !"
      });
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found 🚫" });
    }

    res.status(200).json({ message: "User deleted successfully 👤👍" });
  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Error deleting user 🚫" });
  }
}


export async function isAdmin(req) {

  if(req.user.role === "admin") {
    return true;
  }
  return false;
}

export function isLoggedIn(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Please login to continue 🚫" });
    }
    next();
}


