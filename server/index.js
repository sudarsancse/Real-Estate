import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({path: "../.env"});
import userRouter from "./routes/routes.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:");
  });

const app = express();

app.use("/server", userRouter);

app.listen(5000, () => {
  console.log("Server started on port number 5000");
});
