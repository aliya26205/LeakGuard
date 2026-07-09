import { useState } from 'react';
import {
  Mail,
  Phone,
  KeyRound,
  Code2,
  FileLock2,
  Landmark,
  Info,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

import "./styles/Policies.css";
/* ------------------------------------------------------------------
   Mock data — replace with existing API / Supabase calls.
   Shape mirrors the current policies config; swap this array for
   your real fetch result, the UI below is otherwise unaffected.
------------------------------------------------------------------- */
const INITIAL_POLICIES = [
  {
    id: 'email',
    icon: Mail,
    title: 'Email Detection',
    desc: 'Flags personal and corporate email addresses shared in AI prompts.',
    enabled: true,
    sensitivity: 'Medium',
  },
  {
    id: 'phone',
    icon: Phone,
    title: 'Phone Detection',
    desc: 'Flags phone numbers in any regional or international format.',
    enabled: true,
    sensitivity: 'Medium',
  },
  {
    id: 'password',
    icon: KeyRound,
    title: 'Password Detection',
    desc: 'Blocks credentials and passwords pasted into AI tools in real time.',
    enabled: true,
    sensitivity: 'High',
  },
  {
    id: 'apikey',
    icon: Code2,
    title: 'API Key Detection',
    desc: 'Detects API keys, tokens, and secrets across common provider formats.',
    enabled: true,
    sensitivity: 'High',
  },
  {
    id: 'confidential',
    icon: FileLock2,
    title: 'Confidential Data Detection',
    desc: 'Flags internal documents, source code, and marked-confidential content.',
    enabled: false,
    sensitivity: 'Medium',
  },
  {
    id: 'financial',
    icon: Landmark,
    title: 'Financial Data Detection',
    desc: 'Flags card numbers, bank details, and other financial identifiers.',
    enabled: true,
    sensitivity: 'High',
  },
];

const SENSITIVITY_LEVELS = ['Low', 'Medium', 'High'];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle${checked ? ' toggle-on' : ''}`}
      onClick={onChange}
    >
      <span className="toggle-knob" />
    </button>
  );
}

export default function Policies({ adminName = 'Admin' }) {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);

  const togglePolicy = (id) => {
    // NOTE: wire this to the existing policies API — UI only, logic untouched.
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const setSensitivity = (id, level) => {
    // NOTE: wire this to the existing policies API — UI only, logic untouched.
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, sensitivity: level } : p)));
  };

  const activeCount = policies.filter((p) => p.enabled).length;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar
          title="Policies"
          subtitle={`${activeCount} of ${policies.length} detection rules active`}
          adminName={adminName}
        />

        <div className="page-content policies-content">
          <div className="policies-banner">
            <Info size={16} strokeWidth={2} />
            <span>Changes apply instantly across every registered device. Disabling a rule stops future detection but does not affect existing logs.</span>
          </div>

          <section className="policies-grid">
            {policies.map(({ id, icon: Icon, title, desc, enabled, sensitivity }) => (
              <div className={`policy-card${enabled ? ' policy-card-active' : ''}`} key={id}>
                <div className="policy-card-top">
                  <span className="policy-icon"><Icon size={19} strokeWidth={2} /></span>
                  <Toggle checked={enabled} onChange={() => togglePolicy(id)} label={`Toggle ${title}`} />
                </div>

                <h3 className="policy-title">{title}</h3>
                <p className="policy-desc">{desc}</p>

                <div className="policy-footer">
                  <span className="policy-footer-label">Sensitivity</span>
                  <div className="sensitivity-group" role="group" aria-label={`${title} sensitivity`}>
                    {SENSITIVITY_LEVELS.map((level) => (
                      <button
                        type="button"
                        key={level}
                        disabled={!enabled}
                        className={`sensitivity-btn${sensitivity === level ? ' sensitivity-btn-active' : ''}`}
                        onClick={() => setSensitivity(id, level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
