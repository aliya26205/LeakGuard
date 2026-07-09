// ==========================================
// LeakGuard Backend Server
// ==========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LeakGuard Backend Running 🚀"
    });
});

// API Routes
app.use("/api", routes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 LeakGuard Server running on port ${PORT}`);

});