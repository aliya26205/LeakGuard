import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Radar,
  FileClock,
  Users,
} from "lucide-react";

import api from "./api";

import "./styles/Login.css";

const FEATURES = [
  {
    icon: Radar,
    text: "Real-time monitoring across every registered device",
  },
  {
    icon: FileClock,
    text: "Full audit trail for every AI-tool interaction",
  },
  {
    icon: Users,
    text: "Granular, department-level policy control",
  },
];

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "admin",
        JSON.stringify(res.data.admin)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Left Panel */}

      <div className="login-brand-panel">
        <div
          className="brand-panel-scan"
          aria-hidden="true"
        />

        <div
          className="brand-panel-glow"
          aria-hidden="true"
        />

        <div className="brand-panel-content">
          <div className="brand-panel-logo">
            <span className="brand-mark-lg">
              <ShieldCheck
                size={24}
                strokeWidth={2.4}
              />
            </span>

            <div>
              <span className="brand-name-lg">
                LeakGuard
              </span>

              <span className="brand-tag-lg">
                Intelligent Data Leak Prevention
              </span>
            </div>
          </div>

          <div className="brand-panel-hero">
            <h1>
              Your data.
              <br />
              Watched, always.
            </h1>

            <p>
              LeakGuard monitors every AI-tool
              interaction across your organization,
              catching sensitive data before it
              leaves the building.
            </p>
          </div>

          <ul className="brand-feature-list">
            {FEATURES.map(
              ({ icon: Icon, text }) => (
                <li key={text}>
                  <span className="brand-feature-icon">
                    <Icon
                      size={16}
                      strokeWidth={2}
                    />
                  </span>

                  {text}
                </li>
              )
            )}
          </ul>

          <div className="brand-panel-footer">
            <span className="pill pill-success">
              <span className="pill-dot" />
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel */}

      <div className="login-form-panel">
        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
          <div className="login-form-header">
            <h2>Admin Sign In</h2>

            <p>
              Enter your credentials to access the
              dashboard.
            </p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* Email */}

          <label className="login-field">
            <span>Email Address</span>

            <div className="login-input">
              <Mail
                size={16}
                strokeWidth={2}
              />

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                autoComplete="email"
                required
              />
            </div>
          </label>

          {/* Password */}

          <label className="login-field">
            <span>Password</span>

            <div className="login-input">
              <Lock
                size={16}
                strokeWidth={2}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            </div>
          </label>

          <div className="login-row">
            <label className="login-checkbox">
              <input type="checkbox" />

              <span>
                Remember this device
              </span>
            </label>

            <a
              href="#"
              className="login-forgot"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Signing In..."
              : "Sign In"}

            {!loading && (
              <ArrowRight
                size={16}
                strokeWidth={2}
              />
            )}
          </button>

          <p className="login-footnote">
            Protected by LeakGuard. Every login is
            monitored and securely logged.
          </p>
        </form>
      </div>
    </div>
  );
}