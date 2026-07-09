import { Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/Topbar.css";

export default function Topbar({
  title,
  subtitle,
  adminName = "Admin",
  notificationCount = 3,
}) {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("admin");

    navigate("/login");

  };

  return (
    <header className="topbar">

      <div className="topbar-heading">

        <h1>{title}</h1>

        {subtitle && <p>{subtitle}</p>}

      </div>

      <div className="topbar-actions">

        <div className="topbar-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search employees, logs, alerts..."
          />

        </div>

        <button
          className="icon-btn"
          aria-label="Notifications"
        >

          <Bell size={18} />

          {notificationCount > 0 && (

            <span className="icon-btn-badge">

              {notificationCount}

            </span>

          )}

        </button>

        <button
          className="topbar-profile"
          onClick={handleLogout}
          title="Logout"
        >

          <span className="profile-avatar">

            {adminName.charAt(0).toUpperCase()}

          </span>

          <span className="profile-name">

            {adminName}

          </span>

          <LogOut size={16} />

        </button>

      </div>

    </header>
  );
}