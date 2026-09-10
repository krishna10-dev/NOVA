const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDatabase = require("./src/config/database");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

const errorHandler = require("./src/middleware/errorMiddleware");

const {
  authLimiter
} = require("./src/middleware/rateLimiter");

const app = express();

let databaseConnection;

const ensureDatabaseConnection = async () => {
  if (databaseConnection) {
    return databaseConnection;
  }

  databaseConnection = connectDatabase();

  return databaseConnection;
};

app.use(async (req, res, next) => {
  try {
    await ensureDatabaseConnection();
    next();
  } catch (error) {
    next(error);
  }
});

app.use(helmet());

/* -----------------------------
   CORS
----------------------------- */

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true
  })
);

/* -----------------------------
   Body parsing
----------------------------- */

app.use(express.json());

app.use(cookieParser());

/* -----------------------------
   Basic routes
----------------------------- */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "NOVA API is running"
  });
});

app.get("/api", (req, res) => {
  res.json({
    success: true,
    name: "NOVA",
    version: "1.0.0",
    description:
      "Team productivity platform"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy"
  });
});

/* -----------------------------
   API routes
----------------------------- */

app.use(
  "/api/auth",
  authLimiter,
  authRoutes
);

app.use(
  "/api/projects",
  projectRoutes
);

app.use(
  "/api/projects",
  taskRoutes
);

app.use(
  "/api/projects",
  memberRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

/* -----------------------------
   Error handler
----------------------------- */

app.use(errorHandler);

module.exports = app;