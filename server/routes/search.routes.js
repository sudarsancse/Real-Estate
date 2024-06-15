import express from "express";
import {search} from "../Controllers/search.function.js";

//import {verifyToken} from "../utils/verifyUser.js";

const router = express.Router();

// search function route
router.get("/search", search);

export default router;
