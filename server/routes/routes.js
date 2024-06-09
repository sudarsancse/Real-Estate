import express from "express";
import {test, signup, signin, google} from "../Controllers/userController.js";
import {update, deleteUser, signout} from "../Controllers/userupdate.js";
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

export default router;
