import { useState } from "react";

export default function UsersTable({ users, onSearch, onRoleChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  function handleSearchSubmit(event) {
    event.preventDefault();
    onSearch(searchTerm.trim());
  }

  return (
    <div className="card" id="users">
      <div className="panel-title">User Management</div>
      <p className="muted">Search and filter users by role, name, or email.</p>
      <form className="admin-filter-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search users..."
          className="input"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          className="input"
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            onRoleChange(event.target.value);
          }}
        >
          <option value="">All roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn btn-solid" type="submit">
          Search
        </button>
      </form>

      {users.length === 0 ? (
        <p className="muted">No users match the current filter.</p>
      ) : (
        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Posts</th>
                <th>Recipes</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.postsCount ?? 0}</td>
                  <td>{user.recipesCount ?? 0}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted small">
        TODO: add user action buttons (ban, promote, suspend) once moderation policy is defined.
      </p>
    </div>
  );
}
