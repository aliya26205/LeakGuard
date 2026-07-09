import { useState, useEffect, useMemo } from "react";
import {
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  Clock,
  User,
  Bot,
  ChevronRight,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "./api";

import "./styles/Alerts.css";

const FILTERS = ["All Alerts", "Critical", "High", "Medium", "Low"];

const severityMeta = {
  Critical: {
    pill: "pill-critical",
    icon: AlertOctagon,
  },
  High: {
    pill: "pill-warning",
    icon: ShieldAlert,
  },
  Medium: {
    pill: "pill-warning",
    icon: ShieldAlert,
  },
  Low: {
    pill: "pill-success",
    icon: CheckCircle2,
  },
};

export default function Alerts({ adminName = "Admin" }) {

  const [alerts, setAlerts] = useState([]);

  const [filter, setFilter] = useState("All Alerts");

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchAlerts();

  }, []);

  const fetchAlerts = async () => {

    try {

      const res = await api.get("/alerts");

      setAlerts(res.data.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const handleResolve = async (id) => {

    try {

      await api.put(`/alerts/${id}`, {
        is_read: true,
      });

      fetchAlerts();

    } catch (err) {

      console.log(err);

    }

  };

  const criticalCount = alerts.filter(
    (a) => a.severity === "Critical" && !a.is_read
  ).length;

  const highCount = alerts.filter(
    (a) => a.severity === "High" && !a.is_read
  ).length;

  const resolvedToday = alerts.filter(
    (a) => a.is_read
  ).length;

  const filtered = useMemo(() => {

    if (filter === "All Alerts")
      return alerts;

    return alerts.filter(
      (a) => a.severity === filter
    );

  }, [alerts, filter]);

  const grouped = useMemo(() => {

    const groups = {};

    filtered.forEach((alert) => {

      const date = new Date(
        alert.created_at
      ).toLocaleDateString();

      if (!groups[date])
        groups[date] = [];

      groups[date].push(alert);

    });

    return groups;

  }, [filtered]);

  if (loading) {

    return (

      <div
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >

        Loading Alerts...

      </div>

    );

  }

  return (<div className="app-shell">

  <Sidebar />

  <div className="app-main">

    <Topbar
      title="Alerts"
      subtitle="High-risk and critical leak events requiring review"
      adminName={adminName}
    />

    <div className="page-content alerts-content">

      {/* Summary Cards */}

      <section className="alert-summary-grid">

        <div className="alert-summary-card summary-critical">

          <span className="summary-icon">

            <AlertOctagon size={20} />

          </span>

          <div>

            <span className="summary-value">

              {criticalCount}

            </span>

            <span className="summary-label">

              Open Critical Alerts

            </span>

          </div>

        </div>

        <div className="alert-summary-card summary-high">

          <span className="summary-icon">

            <ShieldAlert size={20} />

          </span>

          <div>

            <span className="summary-value">

              {highCount}

            </span>

            <span className="summary-label">

              Open High Alerts

            </span>

          </div>

        </div>

        <div className="alert-summary-card summary-resolved">

          <span className="summary-icon">

            <CheckCircle2 size={20} />

          </span>

          <div>

            <span className="summary-value">

              {resolvedToday}

            </span>

            <span className="summary-label">

              Resolved Alerts

            </span>

          </div>

        </div>

      </section>

      {/* Filter */}

      <div className="alert-tabs">

        {FILTERS.map((f) => (

          <button
            key={f}
            className={`alert-tab ${
              filter === f ? "alert-tab-active" : ""
            }`}
            onClick={() => setFilter(f)}
          >

            {f}

          </button>

        ))}

      </div>

      {/* Timeline */}

      <div className="panel timeline-panel">

        {Object.keys(grouped).length === 0 && (

          <p className="emp-empty">

            No Alerts Found

          </p>

        )}

        {Object.entries(grouped).map(([date, items]) => (

          <div
            className="timeline-group"
            key={date}
          >

            <span className="timeline-date">

              {date}

            </span>

            <div className="timeline">

              {items.map((alert) => {

                const meta =
                  severityMeta[alert.severity] ||
                  severityMeta.High;

                const Icon = meta.icon;

                return (

                  <div
                    key={alert.id}
                    className={`timeline-item ${
                      alert.is_read
                        ? "timeline-item-resolved"
                        : ""
                    }`}
                  >

                    <span
                      className={`timeline-marker marker-${alert.severity.toLowerCase()}`}
                    >

                      <Icon size={13} />

                    </span>

                    <div className="timeline-card">

                      <div className="timeline-card-top">

                        <span
                          className={`pill ${meta.pill}`}
                        >

                          <span className="pill-dot" />

                          {alert.severity}

                        </span>

                        <span className="timeline-time">

                          <Clock size={12} />

                          {new Date(
                            alert.created_at
                          ).toLocaleTimeString()}

                        </span>

                      </div>

                      <p className="timeline-title">

                        {alert.message}

                      </p>

                      <div className="timeline-meta">

                        <span>

                          <User size={13} />

                          {alert.employees?.full_name}

                        </span>

                        <span>

                          <Bot size={13} />

                          {alert.activity_logs?.ai_tool ||
                            "Unknown"}

                        </span>

                      </div>

                      <div className="timeline-footer">

                        {alert.is_read ? (

                          <span className="pill pill-success">

                            Resolved

                          </span>

                        ) : (

                          <button
                            className="btn-ghost-accent"
                            onClick={() =>
                              handleResolve(alert.id)
                            }
                          >

                            Mark as Resolved

                            <ChevronRight
                              size={13}
                            />

                          </button>

                        )}

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        ))}

      </div>

    </div>

  </div>

</div>

);
}