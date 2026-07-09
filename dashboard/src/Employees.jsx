import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  KeyRound,
  Copy,
  Check,
  ChevronDown,
  Filter,
  MoreVertical,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "./api";

import "./styles/Employees.css";

const statusPillClass = {
  Active: "pill-success",
  Pending: "pill-warning",
  Registered: "pill-success",
  Revoked: "pill-critical",
};

function CopyableKey({ value }) {
  const [copied, setCopied] = useState(false);

  if (!value) return <span className="key-empty">No Key</span>;

  const copyKey = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="key-chip" onClick={copyKey}>
      <span>{value}</span>

      {copied ? (
        <Check size={13} />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
}

export default function Employees({ adminName = "Admin" }) {

  const [employees, setEmployees] = useState([]);

  const [query, setQuery] = useState("");

  const [dept, setDept] = useState("All Departments");

  const [deptOpen, setDeptOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchEmployees();

  }, []);

  const fetchEmployees = async () => {

    try {

      const res = await api.get("/employees");

      setEmployees(res.data.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const departments = [
    "All Departments",
    ...new Set(
      employees.map((e) => e.department).filter(Boolean)
    ),
  ];

  const filtered = useMemo(() => {

    return employees.filter((emp) => {

      const search =
        emp.full_name.toLowerCase().includes(query.toLowerCase()) ||
        emp.email.toLowerCase().includes(query.toLowerCase()) ||
        emp.employee_id.toLowerCase().includes(query.toLowerCase());

      const department =
        dept === "All Departments" ||
        emp.department === dept;

      return search && department;

    });

  }, [employees, query, dept]);

  const generateKey = async (id) => {

    try {

      await api.put(`/employees/${id}/generate-key`);

      fetchEmployees();

    } catch (err) {

      console.log(err);

    }

  };

  const deleteEmployee = async (id) => {

    if (!window.confirm("Delete Employee?")) return;

    try {

      await api.delete(`/employees/${id}`);

      fetchEmployees();

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {

    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
        }}
      >
        Loading Employees...
      </div>
    );

  }

  return (<div className="app-shell">

  <Sidebar />

  <div className="app-main">

    <Topbar
      title="Employees"
      subtitle={`${employees.length} Employees`}
      adminName={adminName}
    />

    <div className="page-content emp-content">

      {/* Toolbar */}

      <div className="emp-toolbar">

        <div className="emp-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search employee..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>

        <div className="emp-filter">

          <button
            className="filter-btn"
            onClick={() => setDeptOpen(!deptOpen)}
          >

            <Filter size={14} />

            {dept}

            <ChevronDown size={14} />

          </button>

          {deptOpen && (

            <div className="filter-menu">

              {departments.map((d) => (

                <button
                  key={d}
                  className={`filter-option ${
                    dept === d ? "filter-option-active" : ""
                  }`}
                  onClick={() => {

                    setDept(d);

                    setDeptOpen(false);

                  }}
                >

                  {d}

                </button>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* Table */}

      <div className="panel emp-panel">

        <div className="table-scroll">

          <table className="data-table emp-table">

            <thead>

              <tr>

                <th>Employee</th>

                <th>Department</th>

                <th>Status</th>

                <th>Activation Key</th>

                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className="emp-empty"
                  >

                    No Employees Found

                  </td>

                </tr>

              ) : (

                filtered.map((emp) => (

                  <tr key={emp.id}>

                    <td>

                      <div className="emp-cell">

                        <span className="employee-avatar">

                          {emp.full_name.charAt(0)}

                        </span>

                        <div className="employee-info">

                          <span className="employee-name">

                            {emp.full_name}

                          </span>

                          <span className="employee-dept cell-muted">

                            {emp.email}

                          </span>

                        </div>

                      </div>

                    </td>

                    <td>

                      {emp.department}

                    </td>

                    <td>

                      <span
                        className={`pill ${statusPillClass[emp.status]}`}
                      >

                        <span className="pill-dot" />

                        {emp.status}

                      </span>

                    </td>

                    <td>

                      <CopyableKey
                        value={emp.activation_key}
                      />

                    </td>

                    <td
                      className="emp-actions-cell"
                    >

                      {!emp.activation_key && (

                        <button
                          className="btn-ghost-accent"
                          onClick={() =>
                            generateKey(emp.id)
                          }
                        >

                          <KeyRound size={14} />

                          Generate Key

                        </button>

                      )}

                      <button
                        className="icon-btn-plain"
                        onClick={() =>
                          deleteEmployee(emp.id)
                        }
                      >

                        <MoreVertical size={16} />

                      </button>

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