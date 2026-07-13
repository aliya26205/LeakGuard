import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  KeyRound,
  Code2,
  FileLock2,
  Landmark,
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import api from "./api";

import "./styles/Policies.css";

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const ACTIONS = ["ALLOW", "WARN", "SANITIZE", "BLOCK"];

const emptyForm = {
  policy_name: "",
  category: "",
  pattern: "",
  severity: "MEDIUM",
  action: "WARN",
  is_active: true,
};

function getIcon(name) {
  const text = (name || "").toLowerCase();

  if (text.includes("email")) return Mail;
  if (text.includes("phone")) return Phone;
  if (text.includes("password")) return KeyRound;
  if (text.includes("api")) return Code2;
  if (text.includes("confidential")) return FileLock2;
  if (text.includes("internal")) return FileLock2;
  if (text.includes("financial")) return Landmark;
  if (text.includes("credit")) return Landmark;

  return Shield;
}

export default function Policies({ adminName = "Admin" }) {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/policies");
      setPolicies(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (policy) => {
    setEditing(policy);

    setForm({
      policy_name: policy.policy_name,
      category: policy.category,
      pattern: policy.pattern,
      severity: policy.severity,
      action: policy.action,
      is_active: policy.is_active,
    });

    setShowModal(true);
  };

  const savePolicy = async () => {
    try {
      if (editing) {
        await api.put(`/policies/${editing.id}`, form);
      } else {
        await api.post("/policies", form);
      }

      setShowModal(false);
      fetchPolicies();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to save policy");
    }
  };

  const deletePolicy = async (id) => {
    if (!window.confirm("Delete this policy?")) return;

    try {
      await api.delete(`/policies/${id}`);
      fetchPolicies();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const togglePolicy = async (policy) => {
    try {
      await api.put(`/policies/${policy.id}`, {
        ...policy,
        is_active: !policy.is_active,
      });

      fetchPolicies();
    } catch (err) {
      alert("Unable to update policy");
    }
  };

  const updateSeverity = async (policy, severity) => {
    try {
      await api.put(`/policies/${policy.id}`, {
        ...policy,
        severity,
      });

      fetchPolicies();
    } catch (err) {
      alert("Unable to update severity");
    }
  };

  const activePolicies = policies.filter((p) => p.is_active).length;

  if (loading) {
    return (
      <div className="dashboard-shell">
        <Sidebar />
        <main className="dashboard-main">
          <Topbar
            title="Security Policies"
            subtitle="Manage LeakGuard detection rules"
            adminName={adminName}
          />
          <div className="page-content">
            <div className="policies-loading">
              <span className="policies-loading-ring" />
              Loading policies…
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <Topbar
          title="Security Policies"
          subtitle="Manage LeakGuard detection rules"
          adminName={adminName}
        />

        <div className="page-content">
          <div className="policy-header">
            <div>
              <h2>Policies</h2>
              <p>
                {activePolicies} Active / {policies.length} Total Policies
              </p>
            </div>

            <button className="add-btn" onClick={openAdd}>
              <Plus size={18} />
              Add Policy
            </button>
          </div>

          {policies.length === 0 ? (
            <div className="policies-empty">
              No policies yet. Click &quot;Add Policy&quot; to create your first detection rule.
            </div>
          ) : (
            <div className="policy-grid">
              {policies.map((policy) => {
                const Icon = getIcon(policy.policy_name);

                return (
                  <div
                    key={policy.id}
                    className={`policy-card ${policy.is_active ? "active" : "inactive"}`}
                  >
                    <div className="policy-card-top">
                      <div className="policy-icon">
                        <Icon size={22} />
                      </div>

                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={policy.is_active}
                          onChange={() => togglePolicy(policy)}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>

                    <h3>{policy.policy_name}</h3>

                    <p className="policy-category">{policy.category}</p>

                    <div className="policy-pattern">
                      <strong>Pattern</strong>
                      <code>{policy.pattern}</code>
                    </div>

                    <div className="policy-row">
                      <span>Severity</span>

                      <select
                        value={policy.severity}
                        onChange={(e) => updateSeverity(policy, e.target.value)}
                        className={`severity-select severity-${policy.severity.toLowerCase()}`}
                      >
                        {SEVERITIES.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="policy-row">
                      <span>Action</span>
                      <span className={`action ${policy.action.toLowerCase()}`}>
                        {policy.action}
                      </span>
                    </div>

                    <div className="policy-actions">
                      <button className="edit-btn" onClick={() => openEdit(policy)}>
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button className="delete-btn" onClick={() => deletePolicy(policy.id)}>
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editing ? "Edit Policy" : "Add New Policy"}</h2>

                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    <X size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="form-group">
                    <label>Policy Name</label>
                    <input
                      type="text"
                      value={form.policy_name}
                      onChange={(e) => setForm({ ...form, policy_name: e.target.value })}
                      placeholder="Salary Information"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      placeholder="Keyword / Email / Regex"
                    />
                  </div>

                  <div className="form-group">
                    <label>Pattern</label>
                    <input
                      type="text"
                      className="mono-input"
                      value={form.pattern}
                      onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                      placeholder="salary"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Severity</label>
                      <select
                        value={form.severity}
                        onChange={(e) => setForm({ ...form, severity: e.target.value })}
                      >
                        {SEVERITIES.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Action</label>
                      <select
                        value={form.action}
                        onChange={(e) => setForm({ ...form, action: e.target.value })}
                      >
                        {ACTIONS.map((action) => (
                          <option key={action} value={action}>
                            {action}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      />
                      <span>Policy Active</span>
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>

                  <button className="save-btn" onClick={savePolicy}>
                    {editing ? "Update Policy" : "Create Policy"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}