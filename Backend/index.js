import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectToDb from "./config/db.js";

// Import all routes
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import lectureRoute from "./routes/lecture.route.js";
import coursePurchaseRoute from "./routes/coursePurchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

// Import error handler
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Connect to Database
connectToDb();

// Middlewares

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "https://growacademy.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GrowAcademy API is running",
  });
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lecture", lectureRoute);
app.use("/api/v1/purchase", coursePurchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ERROR Handler
app.use(errorHandler);

// Star server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Port : ${PORT} Server is running successfully`);
});

export default app;
