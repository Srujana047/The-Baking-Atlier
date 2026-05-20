export default function AdminSidebar({ pendingReports, totalUsers, totalPosts }) {
  return (
    <aside className="admin-sidebar card">
      <div className="sidebar-section">
        <h3>Quick navigation</h3>
        <ul>
          <li><a href="#overview">Overview</a></li>
          <li><a href="#reports">Reports</a></li>
          <li><a href="#moderation">Moderation</a></li>
          <li><a href="#users">Users</a></li>
          <li><a href="#activity">Activity</a></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3>Workload</h3>
        <p>{pendingReports} pending report{pendingReports === 1 ? "" : "s"}</p>
        <p>{totalPosts} active post{totalPosts === 1 ? "" : "s"}</p>
        <p>{totalUsers} users</p>
      </div>

      <div className="sidebar-section">
        <h3>Notes</h3>
        <p className="muted small">
          TODO: add bulk moderation tools, search filters, and mobile admin support.
        </p>
      </div>
    </aside>
  );
}
