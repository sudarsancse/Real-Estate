import express from "express";
import {test, signup, signin} from "../Controllers/userController.js";

const router = express.Router();

router.get("/test", test);

router.post("/signup", signup);
router.post("/signin", signin);

export default router;
