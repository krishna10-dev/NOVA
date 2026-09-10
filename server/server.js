require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDatabase = require("./src/config/database");
const helmet = require("helmet");
const { authLimiter } = require("./src/middleware/rateLimiter");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const app = express();
app.use(helmet());

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDatabase();

// Base & Health Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NOVA API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

// API Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects", taskRoutes);
app.use("/api/projects", memberRoutes);
app.use("/api/tasks", taskRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

// 404 Catch-all Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});