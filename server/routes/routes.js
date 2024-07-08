import express from "express";
import {
  test,
  signup,
  signin,
  google,
  createListing,
  getUserListings,
  getUserContact,
  sendEmail,
  verifyOtp,
  updatedPassword,
} from "../Controllers/userController.js";
import {
  update,
  deleteUser,
  signout,
  deleteListing,
  editlist,
  getListing,
} from "../Controllers/userupdate.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

//forget password
router.post("/sendEmail", sendEmail);
router.post("/verifyOtp", verifyOtp);
router.post("/updated-password/:id", updatedPassword);

// sign out the user
router.get("/signout", signout);

// user update route
router.post("/update/:id", verifyToken, update);
// user delete the user
router.delete("/delete/:id", verifyToken, deleteUser);

// create listiong
router.post("/create", verifyToken, createListing);

// get listing
router.get("/listings/:id", verifyToken, getUserListings);

// listing delete
router.delete("/deletelisting/:id", verifyToken, deleteListing);

// update or edit the listing
router.post("/editlist/:id", verifyToken, editlist);
router.get("/get/:id", getListing);

// contact page
router.get("/:id", verifyToken, getUserContact);

export default router;
