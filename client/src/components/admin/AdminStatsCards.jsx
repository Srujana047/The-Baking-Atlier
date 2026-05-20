export default function AdminStatsCards({ stats }) {
  return (
    <div className="admin-card-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="card admin-stat-card">
          <div className="stat-label">{stat.label}</div>
          <div className="stat-value">{stat.value}</div>
          <p className="muted small">{stat.note}</p>
        </div>
      ))}
    </div>
  );
}
