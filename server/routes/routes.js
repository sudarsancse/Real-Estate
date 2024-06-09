import express from "express";
import {
  test,
  signup,
  signin,
  google,
  createListing,
  getUserListings,
} from "../Controllers/userController.js";
import {
  update,
  deleteUser,
  signout,
  deleteListing,
} from "../Controllers/userupdate.js";
import {verifyToken} from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
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

export default router;
