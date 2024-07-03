import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import crypto from "crypto";

export const testp = (req, res) => {
  res.json({
    message: "Hello Sudarsan sarkar 123",
  });
};

export const payment = async (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    if (!req.body) {
      return res.status(400).send("Bad request");
    }

    const option = req.body;
    const order = await razorpay.orders.create(option);

    if (!order) {
      return res.status(400).send("Bad request");
    }

    res.json(order);
  } catch (error) {
    next(error);
    res.status(500).send(error);
  }
};

export const validate = async (req, res, next) => {
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
  // order_id + " | " + razorpay_payment_id

  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);

  const digest = sha.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).json({msg: " Transaction is not legit!"});
  }

  res.json({
    msg: " Transaction is legit!",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
};
