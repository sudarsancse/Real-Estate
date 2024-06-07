import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";

export const test = (req, res) => {
  res.json({
    message: "Hello Sudarsan sarkar",
  });
};
// sign-Up page
export const signup = async (req, res, next) => {
  const {username, email, password} = req.body;

  const hashPassword = bcryptjs.hashSync(password, 15);
  const newUser = new User({username, email, password: hashPassword});

  try {
    await newUser.save();
    res.status(201).json("User created Sucess");
  } catch (error) {
    next(error);
  }
};

// sign-In page

export const signin = async (req, res, next) => {
  const {username, email, password} = req.body;
  try {
    const validUser = await User.findOne({username});
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "invalid password"));
    const token = jwt.sign({id: validUser._id}, process.env.SECRETKEY_JWT);
    const {password: pass, ...userInfo} = validUser._doc;
    res
      .cookie("access_token", token, {httpOnly: true, expires: 1000})
      .status(200)
      .json({res});
  } catch (error) {
    next(error);
  }
};
