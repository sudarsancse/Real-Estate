import express from "express";
import {test, signup, signin, google} from "../Controllers/userController.js";
import {update} from "../Controllers/userupdate.js";
import {verifyToken} from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);

// user update route
router.post("/update/:id", verifyToken, update);

export default router;
