import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  Download,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "./api";

import "./styles/Logs.css";

const severityPillClass = {
  Critical: "pill-critical",
  High: "pill-critical",
  Medium: "pill-warning",
  Low: "pill-neutral",
};

const actionPillClass = {
  Blocked: "pill-critical",
  Flagged: "pill-warning",
  Allowed: "pill-success",
  Continue: "pill-success",
  Sanitized: "pill-warning",
};

const statusPillClass = {
  Completed: "pill-success",
  Pending: "pill-warning",
};

function FilterDropdown({
  options,
  value,
  onChange,
}) {

  const [open, setOpen] = useState(false);

  return (

    <div className="log-filter">

      <button
        className="filter-btn"
        onClick={() => setOpen(!open)}
      >

        {value}

        <ChevronDown size={14} />

      </button>

      {open && (

        <div className="filter-menu">

          {options.map((opt) => (

            <button
              key={opt}
              className={`filter-option ${
                value === opt
                  ? "filter-option-active"
                  : ""
              }`}
              onClick={() => {

                onChange(opt);

                setOpen(false);

              }}
            >

              {opt}

            </button>

          ))}

        </div>

      )}

    </div>

  );

}

export default function Logs({
  adminName = "Admin",
}) {

  const [logs, setLogs] = useState([]);

  const [query, setQuery] = useState("");

  const [severity, setSeverity] =
    useState("All Severities");

  const [tool, setTool] =
    useState("All Tools");

  const [status, setStatus] =
    useState("All Statuses");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchLogs();

  }, []);

  const fetchLogs = async () => {

    try {

      const res =
        await api.get("/logs");

      setLogs(res.data.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const severities = [
    "All Severities",
    ...new Set(logs.map(l => l.severity)),
  ];

  const tools = [
    "All Tools",
    ...new Set(logs.map(l => l.ai_tool)),
  ];

  const statuses = [
    "All Statuses",
    ...new Set(logs.map(l => l.status)),
  ];

  const filtered = useMemo(() => {

    return logs.filter((log) => {

      const search =
        (log.ai_tool || "")
          .toLowerCase()
          .includes(query.toLowerCase()) ||

        (log.detected_items || [])
          .join(", ")
          .toLowerCase()
          .includes(query.toLowerCase());

      const sev =
        severity ===
          "All Severities" ||
        log.severity === severity;

      const ai =
        tool === "All Tools" ||
        log.ai_tool === tool;

      const stat =
        status === "All Statuses" ||
        log.status === status;

      return (
        search &&
        sev &&
        ai &&
        stat
      );

    });

  }, [
    logs,
    query,
    severity,
    tool,
    status,
  ]);

  const clearFilters = () => {

    setQuery("");

    setSeverity("All Severities");

    setTool("All Tools");

    setStatus("All Statuses");

  };

  if (loading) {

    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >
        Loading Logs...
      </div>
    );

  }

  return ( <div className="app-shell">

  <Sidebar />

  <div className="app-main">

    <Topbar
      title="Activity Logs"
      subtitle={`${filtered.length} of ${logs.length} events shown`}
      adminName={adminName}
    />

    <div className="page-content logs-content">

      {/* Toolbar */}

      <div className="logs-toolbar">

        <div className="emp-search logs-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search AI Tool or Detected Data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>

        <FilterDropdown
          options={severities}
          value={severity}
          onChange={setSeverity}
        />

        <FilterDropdown
          options={tools}
          value={tool}
          onChange={setTool}
        />

        <FilterDropdown
          options={statuses}
          value={status}
          onChange={setStatus}
        />

        {(query ||
          severity !== "All Severities" ||
          tool !== "All Tools" ||
          status !== "All Statuses") && (

          <button
            className="clear-filters-btn"
            onClick={clearFilters}
          >

            <X size={14} />

            Clear Filters

          </button>

        )}

        <button
          className="btn-primary logs-export-btn"
        >

          <Download size={15} />

          Export CSV

        </button>

      </div>

      {/* Table */}

      <div className="panel logs-panel">

        <div className="table-scroll">

          <table className="data-table logs-table">

            <thead>

              <tr>

                <th>AI Tool</th>

                <th>Detected Data</th>

                <th>Severity</th>

                <th>Action</th>

                <th>Website</th>

                <th>Timestamp</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="emp-empty"
                  >

                    No Logs Found

                  </td>

                </tr>

              ) : (

                filtered.map((log) => (

                  <tr key={log.id}>

                    <td>

                      <span className="tool-chip">

                        {log.ai_tool}

                      </span>

                    </td>

                    <td className="cell-mono">

                      {log.detected_items?.join(", ")}

                    </td>

                    <td>

                      <span
                        className={`pill ${severityPillClass[log.severity]}`}
                      >

                        <span className="pill-dot" />

                        {log.severity}

                      </span>

                    </td>

                    <td>

                      <span
                        className={`pill ${actionPillClass[log.action_taken]}`}
                      >

                        {log.action_taken}

                      </span>

                    </td>

                    <td
                      className="cell-muted"
                      style={{
                        maxWidth: "220px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >

                      {log.website_url}

                    </td>

                    <td className="cell-muted">

                      {new Date(
                        log.created_at
                      ).toLocaleString()}

                    </td>

                    <td>

                      <span
                        className={`pill ${statusPillClass[log.status]}`}
                      >

                        {log.status}

                      </span>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  </div>

</div>

);
}