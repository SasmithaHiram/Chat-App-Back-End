import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  
  const { fullName,email,password } = req.body;

  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "PLEASE MUST BE AT LEAST 6 CHARACTERS" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "EMAIL ALREADY EXISTS" });

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedpassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "INVALID USER DATA" });
    }
  } catch (error) {
    console.log("ERROR IN SIGNUP CONTROLLER", error.message);
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const login = (req, res) => {
  res.post("Login Route");
};

export const logout = (req, res) => {
  res.post("Logout Route");
};
