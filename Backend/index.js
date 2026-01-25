import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectToDb from "./config/db.js";

// Routes
import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import lectureRoute from "./routes/lecture.route.js";
import coursePurchaseRoute from "./routes/coursePurchase.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

// Error handler
import errorHandler from "./middleware/errorHandler.js";

const app = express();

/* 
   DATABASE
 */
connectToDb();

/* 
   BODY PARSERS
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* 
   COOKIE PARSER
 */
app.use(cookieParser());

/* 
   CORS 
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://growacademy.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server, Postman, etc.
      if (!origin) return callback(null, true);

      // Allow known origins + all Vercel preview URLs
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight support 
app.options(/.*/, cors());

/* 
   STATIC FILES
 */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* 
   HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GrowAcademy API is running 🚀",
  });
});

/* 
   API ROUTES
 */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/lecture", lectureRoute);
app.use("/api/v1/purchase", coursePurchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

/* 
   404 HANDLER
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

/* 
   GLOBAL ERROR HANDLER
*/
app.use(errorHandler);

/* 
   SERVER
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;
