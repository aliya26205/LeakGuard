

const express = require("express");

const router = express.Router();

const {
    saveLog,
    getLogs,
    registerEmployee,
    loginAdmin,
    getDashboard,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getAlerts,
    updateAlert,
    deleteAlert,
    getPolicies,
    addPolicy,
    updatePolicy,
    deletePolicy,
    getAnalytics,
    generateActivationKey
} = require("./controllers");

// Employee Registration
router.post("/register", registerEmployee);

// Activity Logs
router.post("/log", saveLog);
router.get("/logs", getLogs);
// =========================
// Admin Login
// =========================
router.post("/login", loginAdmin);

// =========================
// Dashboard
// =========================
router.get("/dashboard", getDashboard);

// =========================
// Employees
// =========================
router.get("/employees", getEmployees);
router.post("/employees", addEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);

// =========================
// Alerts
// =========================
router.get("/alerts", getAlerts);
router.put("/alerts/:id", updateAlert);
router.delete("/alerts/:id", deleteAlert);

// =========================
// Policies
// =========================
router.get("/policies", getPolicies);
router.post("/policies", addPolicy);
router.put("/policies/:id", updatePolicy);
router.delete("/policies/:id", deletePolicy);

// =========================
// Analytics
// =========================
router.get("/analytics", getAnalytics);
module.exports = router;

router.put("/employees/:id/generate-key", generateActivationKey);
