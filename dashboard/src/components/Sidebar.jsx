import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileClock,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  LogOut,
  Radar,
} from 'lucide-react';
//import './Sidebar.css';
import "../styles/Sidebar.css";

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/logs', label: 'Activity Logs', icon: FileClock },
  { to: '/alerts', label: 'Alerts', icon: ShieldAlert },
  { to: '/policies', label: 'Policies', icon: SlidersHorizontal },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // NOTE: wire this to existing auth/session logic — logic untouched, UI only.
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <ShieldCheck size={20} strokeWidth={2.4} />
        </div>
        <div className="brand-text">
          <span className="brand-name">LeakGuard</span>
          <span className="brand-tag">Data Loss Prevention</span>
        </div>
      </div>

      <div className="sidebar-status">
        <span className="status-dot" />
        <span>Monitoring active</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Overview</span>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item${isActive ? ' nav-item-active' : ''}`}
          >
            <span className="nav-item-icon"><Icon size={18} strokeWidth={2} /></span>
            <span className="nav-item-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="scan-widget">
          <Radar size={16} strokeWidth={2} className="scan-icon" />
          <div className="scan-copy">
            <span className="scan-title">Live scan</span>
            <span className="scan-sub">All endpoints reporting</span>
          </div>
        </div>

        <button type="button" className="logout-btn" onClick={handleLogout}>
          <LogOut size={17} strokeWidth={2} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
