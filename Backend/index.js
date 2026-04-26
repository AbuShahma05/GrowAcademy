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
      // Allow server-to-server, Postman, curl, etc.
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
   ROOT / HEALTH CHECK ROUTES
   -- Both "/" and "/health" work so the keep-alive ping and 
      Render's own health-check system both have a target.
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GrowAcademy API is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
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

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  /* 
     KEEP-ALIVE PING  
     Render's free tier shuts the server down after ~15 min of inactivity.
     We ping our own /health endpoint every 14 minutes to prevent cold starts.
     This runs AFTER the server is confirmed listening.
  */
  const RENDER_URL =
    process.env.RENDER_EXTERNAL_URL ||   // Render injects this automatically
    `https://growacademy.onrender.com`;

  const keepAlive = () => {
    fetch(`${RENDER_URL}/health`)
      .then(() => console.log(`[keep-alive] ping sent to ${RENDER_URL}/health`))
      .catch((err) => console.warn("[keep-alive] ping failed:", err.message));
  };

  // Ping immediately once on boot, then every 14 minutes
  keepAlive();
  setInterval(keepAlive, 14 * 60 * 1000);
});

export default app;