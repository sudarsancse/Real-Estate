import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import {errorHandler} from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Listing from "../models/listing.User.js";
dotenv.config({path: "../.env"});

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
  const {email, password} = req.body;
  try {
    const validUser = await User.findOne({email});
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "invalid password"));
    const token = jwt.sign({id: validUser._id}, process.env.SECRETKEY_JWT);
    const {password: pass, ...rest} = validUser._doc;
    res.cookie("access_token", token, {httpOnly: true}).status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Oauth || // google page
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.SECRETKEY_JWT);
      const {password: pass, ...rest} = user._doc;
      res
        .cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 15);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.SECRETKEY_JWT);
      const {password: pass, ...rest} = newUser._doc;
      res
        .cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

// create listing user

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

// get User Listings request
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({UserRef: req.params.id});
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, "You can only view your own listings!"));
  }
};

// get user contact request

export const getUserContact = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const {password: pass, ...rest} = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
