import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import {errorHandler} from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "Hello Sudarsan sarkar",
  });
};

export const signup = async (req, res, next) => {
  const {username, email, password} = req.body;

  const hashPassword = bcryptjs.hashSync(password, 15);
  const newUser = new User({username, email, password: hashPassword});

  try {
    await newUser.save();
    res.status(201).json("User created Sucess");
  } catch (error) {
    next(errorHandler(550, "error from the function"));
  }
};
