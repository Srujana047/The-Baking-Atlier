export default function ActivityLogPanel({ logs }) {
  return (
    <div className="card" id="activity">
      <div className="panel-title">Recent Admin Activity</div>
      <p className="muted">Track recent moderation events and system actions.</p>
      {logs.length === 0 ? (
        <p className="muted">No admin activity recorded yet.</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Target</th>
                <th>Admin</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.action}</td>
                  <td>{log.targetType} {log.targetId || "-"}</td>
                  <td>{log.adminId?.name || "System"}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="muted small">
        TODO: add filter by action type, export log history, and audit search.
      </p>
    </div>
  );
}
