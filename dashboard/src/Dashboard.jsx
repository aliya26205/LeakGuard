import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Laptop,
  ShieldAlert,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
  KeyRound,
  FileDown,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import api from './api';

import "./styles/Dashboard.css";

const QUICK_ACTIONS = [
  {
    label: 'Generate Activation Key',
    desc: 'Onboard a new device',
    icon: KeyRound,
    to: '/employees',
  },
  {
    label: 'Review Alerts',
    desc: 'View security alerts',
    icon: ShieldAlert,
    to: '/alerts',
  },
  {
    label: 'Export Logs',
    desc: 'Download activity CSV',
    icon: FileDown,
    to: '/logs',
  },
  {
    label: 'Manage Policies',
    desc: 'Tune detection rules',
    icon: SlidersHorizontal,
    to: '/policies',
  },
];

const severityPillClass = {
  Critical: 'pill-critical',
  High: 'pill-critical',
  Medium: 'pill-warning',
  Low: 'pill-neutral',
};

const statusPillClass = {
  Blocked: 'pill-critical',
  Flagged: 'pill-warning',
  Allowed: 'pill-success',
  Active: 'pill-success',
  Pending: 'pill-warning',
  Completed: 'pill-success',
  Sanitized: 'pill-warning',
  Continue: 'pill-success',
};

export default function Dashboard({ adminName = 'Admin' }) {

  const [stats, setStats] = useState({
    totalEmployees: 0,
    registeredDevices: 0,
    totalLeaks: 0,
    criticalAlerts: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res = await api.get("/dashboard");

      setStats({
        totalEmployees: res.data.stats.totalEmployees || 0,
        registeredDevices: res.data.stats.registeredDevices || 0,
        totalLeaks: res.data.stats.totalLeaks || 0,
        criticalAlerts: res.data.stats.criticalAlerts || 0,
      });

      setRecentActivity(res.data.recentActivity || []);
      setRecentEmployees(res.data.recentEmployees || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const STATS = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      delta: "",
      trend: "up",
      icon: Users,
      accent: false,
    },
    {
      label: "Registered Devices",
      value: stats.registeredDevices,
      delta: "",
      trend: "up",
      icon: Laptop,
      accent: false,
    },
    {
      label: "Leak Attempts",
      value: stats.totalLeaks,
      delta: "",
      trend: "up",
      icon: ShieldAlert,
      accent: true,
    },
    {
      label: "Critical Alerts",
      value: stats.criticalAlerts,
      delta: "",
      trend: "down",
      icon: AlertOctagon,
      accent: true,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        Loading Dashboard...
      </div>
    );
  }

  return (<div className="app-shell">
  <Sidebar />

  <div className="app-main">
    <Topbar
      title="Dashboard"
      subtitle="Real-time visibility into data leak activity"
      adminName={adminName}
    />

    <div className="page-content dash-content">

      {/* Welcome */}
      <section className="welcome-card">
        <div className="welcome-scan" aria-hidden="true" />

        <div className="welcome-text">
          <span className="welcome-eyebrow">{today}</span>

          <h2>Welcome back, {adminName}.</h2>

          <p>
            Your organization is being actively monitored across{" "}
            <strong>{stats.registeredDevices}</strong> registered devices.
          </p>
        </div>

        <div className="welcome-status">
          <span className="pill pill-success">
            <span className="pill-dot" />
            System Operational
          </span>

          <Link to="/alerts" className="welcome-cta">
            View Alerts
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-grid">
        {STATS.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={`stat-card${accent ? " stat-card-accent" : ""}`}
          >
            <div className="stat-top">
              <span className="stat-icon">
                <Icon size={20} />
              </span>
            </div>

            <span className="stat-value">{value}</span>

            <span className="stat-label">{label}</span>
          </div>
        ))}
      </section>

      {/* Main Grid */}

      <section className="dash-grid">

        {/* Recent Activity */}

        <div className="panel activity-panel">

          <div className="panel-header">

            <div>
              <h3>Recent Activity</h3>
              <p>Latest AI Tool Events</p>
            </div>

            <Link to="/logs" className="panel-link">
              View All
              <ArrowRight size={15} />
            </Link>

          </div>

          <div className="table-scroll">

            <table className="data-table">

              <thead>

                <tr>

                  <th>Employee</th>
                  <th>AI Tool</th>
                  <th>Detected Data</th>
                  <th>Severity</th>
                  <th>Action</th>
                  <th>Time</th>

                </tr>

              </thead>

              <tbody>

                {recentActivity.length === 0 ? (

                  <tr>

                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No Activity Found
                    </td>

                  </tr>

                ) : (

                  recentActivity.map((row) => (

                    <tr key={row.id}>

                      <td className="cell-primary">
                        {row.employees?.full_name}
                      </td>

                      <td>{row.ai_tool}</td>

                      <td className="cell-mono">
                        {row.detected_items?.join(", ")}
                      </td>

                      <td>

                        <span
                          className={`pill ${
                            severityPillClass[row.severity]
                          }`}
                        >
                          <span className="pill-dot" />
                          {row.severity}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`pill ${
                            statusPillClass[row.action_taken]
                          }`}
                        >
                          {row.action_taken}
                        </span>

                      </td>

                      <td className="cell-muted">

                        {new Date(row.created_at).toLocaleString()}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Right Side */}

        <div className="side-column">

          <div className="panel">

            <div className="panel-header">

              <div>

                <h3>Recent Employees</h3>

                <p>Latest Registered Employees</p>

              </div>

              <Link to="/employees" className="panel-link">

                View All

                <ArrowRight size={15} />

              </Link>

            </div>

            <ul className="employee-list">

              {recentEmployees.length === 0 ? (

                <li>No Employees</li>

              ) : (

                recentEmployees.map((emp) => (

                  <li
                    key={emp.id}
                    className="employee-row"
                  >

                    <span className="employee-avatar">
                      {emp.full_name.charAt(0)}
                    </span>

                    <div className="employee-info">

                      <span className="employee-name">
                        {emp.full_name}
                      </span>

                      <span className="employee-dept">
                        {emp.department}
                      </span>

                    </div>

                    <span
                      className={`pill ${
                        statusPillClass[emp.status]
                      }`}
                    >
                      {emp.status}
                    </span>

                  </li>

                ))

              )}

            </ul>

          </div>

          {/* Quick Actions */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h3>Quick Actions</h3>

                <p>Common Admin Tasks</p>

              </div>

            </div>

            <div className="quick-actions">

              {QUICK_ACTIONS.map(
                ({ label, desc, icon: Icon, to }) => (

                  <Link
                    key={label}
                    to={to}
                    className="quick-action"
                  >

                    <span className="quick-action-icon">

                      <Icon size={18} />

                    </span>

                    <div className="quick-action-text">

                      <span>{label}</span>

                      <p>{desc}</p>

                    </div>

                  </Link>

                )
              )}

            </div>

          </div>

        </div>

      </section>

    </div>

  </div>

</div>

);
}