import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";

export const test = (req, res) => {
  res.json({
    message: "Hello Sudarsan sarkar",
  });
};

export const signup = async (req, res) => {
  const {username, email, password} = req.body;

  const hashPassword = bcryptjs.hashSync(password, 15);
  const newUser = new User({username, email, password: hashPassword});

  try {
    await newUser.save();
    res.status(201).json("User created Sucess");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
