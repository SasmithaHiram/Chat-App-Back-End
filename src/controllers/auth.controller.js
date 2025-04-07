import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "ALL FIELDS ARE REQUIRED" });
    }
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "INVALID CREDENTIALS" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "INVALID CREDENTIALS" });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("ERROR IN LOGIN CONTROLLER", error.message);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "LOGGED OUT SUCCESSFULLY" });
  } catch (error) {
    console.log("ERROR IN LOGOUT CONTROLLER, error.message");
    res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const updateProfile = async (req, res) => {};
