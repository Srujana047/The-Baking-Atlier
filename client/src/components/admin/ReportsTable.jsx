export default function ReportsTable({ reports, onResolve, onDismiss }) {
  return (
    <div className="card">
      <div className="panel-title" id="reports">Report Moderation</div>
      <p className="muted">Review recent reports and take action on inappropriate content.</p>
      {reports.length === 0 ? (
        <p className="muted">No pending reports at the moment.</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reported content</th>
                <th>Reporter</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="admin-warning-row">
                  <td>
                    <strong>{report.reportedType}</strong>
                    <div className="small muted">ID: {report.reportedId}</div>
                  </td>
                  <td>{report.reporterId?.name || "Unknown"}</td>
                  <td>{report.reason}</td>
                  <td>{report.status}</td>
                  <td>{new Date(report.createdAt).toLocaleString()}</td>
                  <td className="admin-actions-cell">
                    <button
                      className="btn btn-outline"
                      type="button"
                      onClick={() => onDismiss(report._id)}
                    >
                      Dismiss
                    </button>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => onResolve(report._id)}
                    >
                      Mark reviewed
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
