import "./UserRecommendations.css";

/**
 * UserRecommendations Component
 * Sidebar showing suggested users/bakers to follow
 * 
 * Phase 2: Placeholder structure with mock data
 * Phase 3+: Implement actual recommendation algorithm and follow system
 * 
 * Props:
 * - onUserSelect: function - callback when user clicks on a recommendation
 */
export default function UserRecommendations({ onUserSelect }) {
  // TODO: fetch recommendations from backend API
  // TODO: implement recommendation algorithm based on:
  //   - mutual followers
  //   - similar interests
  //   - engagement patterns
  //   - user location (optional)

  // Mock data for Phase 2
  const recommendations = [
    {
      id: "1",
      name: "Sarah's Soufflés",
      specialty: "French pastries",
      avatar: "👩‍🍳"
    },
    {
      id: "2",
      name: "Marco's Focaccia",
      specialty: "Italian breads",
      avatar: "👨‍🍳"
    },
    {
      id: "3",
      name: "Emma's Éclairs",
      specialty: "Chocolate desserts",
      avatar: "👩‍🍳"
    },
    {
      id: "4",
      name: "James' Jams",
      specialty: "Jams & preserves",
      avatar: "👨‍🍳"
    },
    {
      id: "5",
      name: "Lisa's Loaves",
      specialty: "Sourdough bread",
      avatar: "👩‍🍳"
    }
  ];

  // TODO: implement loading state
  // TODO: implement error handling
  // TODO: add "see more" pagination

  return (
    <aside className="recommendations-sidebar">
      <div className="sidebar-header">
        <h3>Recommended Bakers</h3>
        {/* TODO: add refresh recommendations button */}
      </div>

      <div className="recommendations-list">
        {recommendations.map((user) => (
          <div
            key={user.id}
            className="recommendation-card"
            onClick={() => onUserSelect?.(user.id)}
          >
            <div className="rec-avatar">{user.avatar}</div>

            <div className="rec-info">
              <h4 className="rec-name">{user.name}</h4>
              <p className="rec-specialty">{user.specialty}</p>
            </div>

            {/* TODO: replace with actual follow button when implemented */}
            <button
              className="btn btn-outline btn-small"
              onClick={(e) => {
                e.stopPropagation();
                // TODO: implement follow functionality (Phase 3+)
                alert("Follow feature coming in Phase 3!");
              }}
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <p className="muted">
          {/* TODO: add "Show more" link to full recommendations page */}
          Discover more bakers
        </p>
      </div>
    </aside>
  );
}
