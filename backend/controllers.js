// ==========================================
// LeakGuard Controllers
// ==========================================

const supabase = require("./supabase");
const crypto = require("crypto");

// ==========================================
// Save Activity Log
// ==========================================

const saveLog = async (req, res) => {
  try {
    const {
      employee_id,
      ai_tool,
      detected_items,
      severity,
      action_taken,
      website_url,
      status,
    } = req.body;

    const { data, error } = await supabase
      .from("activity_logs")
      .insert([
        {
          employee_id,
          ai_tool,
          detected_items,
          severity,
          action_taken,
          website_url,
          status,
        },
      ])
      .select();

    // Create Alert Automatically

    if (!error && data.length > 0) {
      const { data: alertData, error: alertError } = await supabase
        .from("alerts")
        .insert([
          {
            activity_log_id: data[0].id,
            employee_id,
            message: `${severity} sensitive data detected in ${ai_tool}`,
            severity,
            is_read: false,
          },
        ])
        .select();

      //console.log("Alert Data:", alertData);
      //console.log("Alert Error:", alertError);
    }

    if (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        error,
      });
    }

    res.json({
      success: true,
      message: "Activity Logged Successfully",
      data,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Get All Logs
// ==========================================

const getLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Register Employee
// ==========================================

const registerEmployee = async (req, res) => {
  try {
    console.log("================================");
    console.log("REGISTER REQUEST");
    console.log(req.body);

    const { employee_id, activation_key } = req.body;

    console.log("Employee ID :", employee_id);
    console.log("Activation Key :", activation_key);

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("employee_id", employee_id)
      .eq("activation_key", activation_key)
      .single();

    console.log("Supabase Data :", data);
    console.log("Supabase Error :", error);

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Invalid Employee ID or Activation Key",
      });
    }

    if (data.extension_installed) {
      return res.status(400).json({
        success: false,
        message: "This device is already registered.",
      });
    }

    const token = crypto.randomUUID();

    const { error: updateError } = await supabase
      .from("employees")
      .update({
        extension_installed: true,
        extension_token: token,
        //registered_at: new Date()
      })
      .eq("id", data.id);

    if (updateError) {
      console.log(updateError);

      return res.status(500).json({
        success: false,
        message: updateError.message,
      });
    }

    res.json({
      success: true,

      employee: {
        id: data.id,
        employee_id: data.employee_id,
        full_name: data.full_name,
        email: data.email,
        department: data.department,
        extension_token: token,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// ==========================================
// Admin Login
// ==========================================

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email",
      });
    }

    // Simple password check (for demo)
    if (data.password_hash !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.json({
      success: true,
      admin: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Dashboard Data
// ==========================================

const getDashboard = async (req, res) => {
  try {
    const { count: totalEmployees } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true });

    const { count: registeredDevices } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("extension_installed", true);

    const { count: totalLeaks } = await supabase
      .from("activity_logs")
      .select("*", { count: "exact", head: true });

    const { count: criticalAlerts } = await supabase
      .from("alerts")
      .select("*", { count: "exact", head: true })
      .eq("severity", "Critical");

    const { data: recentActivity } = await supabase
      .from("activity_logs")
      .select(
        `
                *,
                employees(full_name)
            `,
      )
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: recentEmployees } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    res.json({
      success: true,

      stats: {
        totalEmployees,
        registeredDevices,
        totalLeaks,
        criticalAlerts: criticalAlerts || 0,
      },

      recentActivity,
      recentEmployees,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Get All Employees
// ==========================================

const getEmployees = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Add Employee
// ==========================================

const addEmployee = async (req, res) => {
  try {
    const { employee_id, full_name, email, department } = req.body;

    const activation_key = crypto.randomBytes(4).toString("hex").toUpperCase();

    const { data, error } = await supabase
      .from("employees")
      .insert([
        {
          employee_id,
          full_name,
          email,
          department,
          activation_key,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Employee Added Successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Update Employee
// ==========================================

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { full_name, email, department, status } = req.body;

    const { data, error } = await supabase
      .from("employees")
      .update({
        full_name,
        email,
        department,
        status,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Employee Updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Delete Employee
// ==========================================

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Employee Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Get All Alerts
// ==========================================

const getAlerts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("alerts")
      .select(
        `
                *,
                employees(full_name, employee_id),
                activity_logs(ai_tool)
            `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Update Alert
// ==========================================

const updateAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const { is_read } = req.body;

    const { data, error } = await supabase
      .from("alerts")
      .update({
        is_read,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Alert Updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Delete Alert
// ==========================================

const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("alerts").delete().eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Alert Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Get Policies
// ==========================================

const getPolicies = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("policies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Add Policy
// ==========================================

const addPolicy = async (req, res) => {
  try {
    const { policy_name, category, pattern, severity, action } = req.body;

    const { data, error } = await supabase
      .from("policies")
      .insert([
        {
          policy_name,
          category,
          pattern,
          severity,
          action,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Policy Added Successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Update Policy
// ==========================================

const updatePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const { policy_name, category, pattern, severity, action, is_active } =
      req.body;

    const { data, error } = await supabase
      .from("policies")
      .update({
        policy_name,
        category,
        pattern,
        severity,
        action,
        is_active,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Policy Updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Delete Policy
// ==========================================

const deletePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("policies").delete().eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Policy Deleted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Analytics
// ==========================================

const getAnalytics = async (req, res) => {
  try {
    const { data: logs } = await supabase
      .from("activity_logs")
      .select("severity, ai_tool");

    const severity = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    const aiTools = {};

    logs.forEach((log) => {
      if (severity[log.severity] !== undefined) severity[log.severity]++;

      aiTools[log.ai_tool] = (aiTools[log.ai_tool] || 0) + 1;
    });

    res.json({
      success: true,

      severity,

      aiTools,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// ==========================================
// Generate Activation Key
// ==========================================

const generateActivationKey = async (req, res) => {
  try {
    const { id } = req.params;

    const activation_key = crypto.randomBytes(4).toString("hex").toUpperCase();

    const { data, error } = await supabase
      .from("employees")
      .update({
        activation_key,
        status: "Active",
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Activation Key Generated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
module.exports = {
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
  generateActivationKey,
};
