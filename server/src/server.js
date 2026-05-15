import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { connectToDatabase } from "./config/db.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

// --- Core middleware ---
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: false
    // TODO: if you switch to cookie auth later, set credentials:true and configure cookies/CSRF.
  })
);
app.use(morgan("dev"));

// --- Healthcheck ---
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "the-baking-atlier-api", phase: 2 });
});

// --- Routes ---
app.use("/api/auth", authRoutes);

// Phase 2: Social Feed Routes
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/reports", reportRoutes);

// TODO: Phase 3+ routes
// app.use("/api/recipes", recipesRoutes);
// app.use("/api/users/recommendations", userRecommendationRoutes);
// app.use("/api/search", searchRoutes);
// app.use("/api/admin", adminRoutes);

// --- Error handling ---
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectToDatabase(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

start();

