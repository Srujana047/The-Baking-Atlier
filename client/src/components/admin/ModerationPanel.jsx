export default function ModerationPanel({ posts, comments, recipes, onDeletePost, onDeleteComment, onDeleteRecipe }) {
  return (
    <div className="card" id="moderation">
      <div className="panel-title">Moderation Controls</div>
      <p className="muted">Moderate community content from one place. Delete inappropriate items or use placeholder actions for planning.</p>

      <section className="admin-section">
        <h4>Posts</h4>
        {posts.length === 0 ? (
          <p className="muted">No posts found.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Caption</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.authorName}</td>
                    <td>{post.caption.slice(0, 60)}{post.caption.length > 60 ? "…" : ""}</td>
                    <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions-cell">
                      <button className="btn btn-outline" type="button" onClick={() => onDeletePost(post._id)}>
                        Delete
                      </button>
                      <button className="btn btn-ghost" type="button" disabled>
                        Edit placeholder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h4>Comments</h4>
        {comments.length === 0 ? (
          <p className="muted">No comments found.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Author</th>
                  <th>Text</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td>{comment.authorName}</td>
                    <td>{comment.text.slice(0, 70)}{comment.text.length > 70 ? "…" : ""}</td>
                    <td>{new Date(comment.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions-cell">
                      <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => onDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                      <button className="btn btn-ghost" type="button" disabled>
                        Review placeholder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <h4>Recipes</h4>
        {recipes.length === 0 ? (
          <p className="muted">No recipes found.</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe._id}>
                    <td>{recipe.title}</td>
                    <td>{recipe.authorName}</td>
                    <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                    <td className="admin-actions-cell">
                      <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => onDeleteRecipe(recipe._id)}
                      >
                        Delete
                      </button>
                      <button className="btn btn-ghost" type="button" disabled>
                        Moderate placeholder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="muted small">
        TODO: add advanced recipe moderation workflows, bulk action selection, and review notes.
      </p>
    </div>
  );
}
