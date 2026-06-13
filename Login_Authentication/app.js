const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const pool = require("./db/connection");

const userRoutes = require("./routes/users");

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.query.token;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Routes
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Database connection test and server startup
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("✓ Database connected successfully");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
    process.exit(1);
  });
