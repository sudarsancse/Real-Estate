import bcryptjs from "bcryptjs";
import User from "../models/UserModel.js";
import OTP from "../models/otp.js";
import { errorHandler, successHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Listing from "../models/listing.User.js";
dotenv.config({ path: "../.env" });
import nodemailer from "nodemailer";

export const test = (req, res) => {
  res.json({
    message: "Hello Sudarsan sarkar",
  });
};

// sign-Up page

export const signup = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });

    if (existingUser) {
      let message;
      if (existingUser.email === email) {
        message = "Email already exists.";
      } else if (existingUser.username === username) {
        message = "Username already exists.";
      }

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message,
      });
    }

    const hashPassword = bcryptjs.hashSync(password, 15);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
      name,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// sign-In page

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!validUser) return next(errorHandler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "invalid password"));
    const token = jwt.sign({ id: validUser._id }, process.env.SECRETKEY_JWT);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Oauth || // google page
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRETKEY_JWT);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
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
        name: req.body.name,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRETKEY_JWT);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true })
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
      const listings = await Listing.find({ UserRef: req.params.id });
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

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// forgrt password functions

export const sendEmail = async (req, res, next) => {
  const data = req.body.email;
  const email = await User.findOne({ email: data });
  if (!email) return next(errorHandler(404, "email id not found"));
  try {
    const name = email.name;
    const userId = email._id;
    let otpGenerate = Math.floor(1000 + Math.random() * 9000);

    const otpData = new OTP({
      email: data,
      Code: otpGenerate,
      expireAt: new Date(Date.now() + 120 * 1000),
      UserRef: userId,
    });
    //
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", //smtp.ethereal.email
      port: 465,
      auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Dream Home 🏡" <sudarsansarkarcst@gmail.com>', // sender address
      to: email.email, // list of receivers
      subject: `Hello ${name} ✔ `, // Subject line
      text: "Hello world?", // plain text body
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p style="font-size: 20px">Dear <strong style="color: #7286D3;">${name}</strong>,</p>
                <p>We received a request to reset the password for your account. To proceed with the password reset, please use the following One-Time Password (OTP):</p>
                <p style="font-size: 20px; font-weight: bold; color: #e74c3c;">Your OTP is: ${otpGenerate}</p>
                <p style="color: #e74c3c;">Please note: This OTP is valid for only 2 minutes. If you did not request a password reset, please ignore this email or contact our support team.</p>
                <p>Thank you for using our services.</p>
                <br/>
                <p>Best regards,</p>
            </div>`, // html body
    });

    //console.log("Message sent: %s", info.messageId);
    const response = await otpData.save();
    next(successHandler(201, "Please check your email and enter the OTP"));
    //res.status(201).json("Please check your email ID and enter the OTP");
  } catch (error) {
    next(error);
  }
};

//verifyOtp

export const verifyOtp = async (req, res, next) => {
  const otp = req.body.otp;
  const Email = req.body.email;

  const data = await OTP.findOne({ email: Email });
  if (!data) return next(errorHandler(404, "email id not found"));

  try {
    const otpCode = data.Code;
    const ID = data.UserRef;
    if (otpCode === otp) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        statusCode: 200,
        ID,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP", statusCode: 400 });
    }
  } catch (error) {
    next(error);
  }
};

// update password
export const updatedPassword = async (req, res, next) => {
  const id = req.params.id;
  const Newpass = req.body;

  try {
    const user = await User.findById({ _id: id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const hashedPassword = bcryptjs.hashSync(Newpass.Confirmpass, 15);
    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      statusCode: 200,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
