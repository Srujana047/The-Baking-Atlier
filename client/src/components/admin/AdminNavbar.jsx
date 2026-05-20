import { FaBell, FaShieldAlt } from "react-icons/fa";

export default function AdminNavbar({ adminName }) {
  return (
    <div className="admin-topbar card">
      <div>
        <p className="muted">Admin panel</p>
        <h2>Welcome back, {adminName || "Admin"}</h2>
      </div>
      <div className="admin-notification-pill">
        <FaBell size={18} />
        <span>Alerts placeholder</span>
      </div>
      <div className="admin-role-pill">
        <FaShieldAlt size={16} />
        <span>Moderator mode</span>
      </div>
    </div>
  );
}
