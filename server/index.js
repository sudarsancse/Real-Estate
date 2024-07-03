import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import userRouter from "./routes/routes.js";
import searchRouter from "./routes/search.routes.js";
import paymentGatewayRouter from "./routes/paymentGatway.routes.js";
import cookieParser from "cookie-parser";
import path from "path";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

// payment gatway
app.use("/", paymentGatewayRouter);

//search route
app.use("/", searchRouter);

app.use("/", userRouter);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(5000, () => {
  console.log("Server started on port number 5000");
});
