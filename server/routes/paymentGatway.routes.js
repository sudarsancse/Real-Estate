import express from "express";
import {testp, payment, validate} from "../Controllers/payment.function.js";

const router = express.Router();

router.get("/testp", testp);
router.post("/payment", payment);
router.post("/validate/:id", validate);
export default router;
