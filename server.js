import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import studentRoutes from "./routes/studentRoutes.js";
import { apiLimiter } from "./middleware/rateLimiter.js"; 
import authRoutes from "./routes/authRoutes.js"
import errorHandler from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
 dotenv.config()
const app = express();
connectDB(); ///  call the db connection funtion
app.use(express.json());
app.use(morgan("dev"))
app.use("/api",apiLimiter)   ////  api limier apply for all routes
app.use("/api", studentRoutes);
app.use("/api", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use(errorHandler) 

const PORT = process.env.PORT||5050;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT} ✅`);
});
