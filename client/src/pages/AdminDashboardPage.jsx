import { useEffect, useMemo, useState } from "react";
import { createHttpClient } from "../api/http";
import { createAdminApi } from "../api/adminApi";
import { useAuth } from "../context/AuthContext.jsx";
import AdminNavbar from "../components/admin/AdminNavbar.jsx";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminStatsCards from "../components/admin/AdminStatsCards.jsx";
import ReportsTable from "../components/admin/ReportsTable.jsx";
import ModerationPanel from "../components/admin/ModerationPanel.jsx";
import UsersTable from "../components/admin/UsersTable.jsx";
import ActivityLogPanel from "../components/admin/ActivityLogPanel.jsx";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { token, user } = useAuth();
  const http = useMemo(() => createHttpClient({ getToken: () => token }), [token]);
  const adminApi = useMemo(() => createAdminApi(http), [http]);

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalRecipes: 0,
    totalComments: 0,
    totalReports: 0,
    pendingReports: 0
  });
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [usersRoleFilter, setUsersRoleFilter] = useState("");

  async function loadDashboard() {
    try {
      const [analyticsData, reportsData, postsData, commentsData, recipesData, usersData, logsData] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getReports("pending", 0, 10),
        adminApi.getPosts("", 0, 8),
        adminApi.getComments("", 0, 8),
        adminApi.getRecipes("", 0, 6),
        adminApi.getUsers("", "", 0, 10),
        adminApi.getLogs(0, 8)
      ]);

      setAnalytics(analyticsData);
      setReports(reportsData.reports);
      setPosts(postsData.posts);
      setComments(commentsData.comments);
      setRecipes(recipesData.recipes);
      setUsers(usersData.users);
      setLogs(logsData.logs);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);
    }
  }

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleUpdateReports(reportId, status) {
    try {
      await adminApi.updateReportStatus(reportId, status);
      setReports((current) => current.filter((report) => report._id !== reportId));
    } catch (error) {
      console.error("Failed to update report status:", error);
      alert("Unable to update report status right now.");
    }
  }

  async function handleDeletePost(postId) {
    try {
      await adminApi.deletePost(postId);
      setPosts((current) => current.filter((post) => post._id !== postId));
      setAnalytics((current) => ({ ...current, totalPosts: Math.max(0, current.totalPosts - 1) }));
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Unable to delete post right now.");
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await adminApi.deleteComment(commentId);
      setComments((current) => current.filter((comment) => comment._id !== commentId));
      setAnalytics((current) => ({ ...current, totalComments: Math.max(0, current.totalComments - 1) }));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Unable to delete comment right now.");
    }
  }

  async function handleDeleteRecipe(recipeId) {
    try {
      await adminApi.deleteRecipe(recipeId);
      setRecipes((current) => current.filter((recipe) => recipe._id !== recipeId));
      setAnalytics((current) => ({ ...current, totalRecipes: Math.max(0, current.totalRecipes - 1) }));
    } catch (error) {
      console.error("Failed to delete recipe:", error);
      alert("Unable to delete recipe right now.");
    }
  }

  async function handleUserSearch(searchTerm) {
    try {
      const data = await adminApi.getUsers(searchTerm, usersRoleFilter, 0, 10);
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to search users:", error);
    }
  }

  async function handleRoleChange(roleValue) {
    setUsersRoleFilter(roleValue);
    try {
      const data = await adminApi.getUsers("", roleValue, 0, 10);
      setUsers(data.users);
    } catch (error) {
      console.error("Failed to filter users:", error);
    }
  }

  const cards = useMemo(
    () => [
      { label: "Total users", value: analytics.totalUsers, note: "All registered accounts" },
      { label: "Total posts", value: analytics.totalPosts, note: "Active community content" },
      { label: "Total recipes", value: analytics.totalRecipes, note: "Published recipe entries" },
      { label: "Total comments", value: analytics.totalComments, note: "Community replies" },
      { label: "Total reports", value: analytics.totalReports, note: "Reported items in the system" },
      { label: "Pending reports", value: analytics.pendingReports, note: "Need review from admin" }
    ],
    [analytics]
  );

  return (
    <div className="page admin-shell">
      <div className="container">
        <AdminNavbar adminName={user?.name} />

        <div className="admin-dashboard-grid">
          <AdminSidebar
            pendingReports={analytics.pendingReports}
            totalUsers={analytics.totalUsers}
            totalPosts={analytics.totalPosts}
          />

          <main className="admin-main">
            <section id="overview" className="admin-section-card">
              <div className="panel-title">Admin Analytics Overview</div>
              <p className="muted">Quick summary of community health, moderation workload, and admin activity.</p>
              <AdminStatsCards stats={cards} />
            </section>

            <ReportsTable
              reports={reports}
              onResolve={(reportId) => handleUpdateReports(reportId, "reviewed")}
              onDismiss={(reportId) => handleUpdateReports(reportId, "resolved")}
            />

            <ModerationPanel
              posts={posts}
              comments={comments}
              recipes={recipes}
              onDeletePost={handleDeletePost}
              onDeleteComment={handleDeleteComment}
              onDeleteRecipe={handleDeleteRecipe}
            />

            <UsersTable
              users={users}
              onSearch={handleUserSearch}
              onRoleChange={handleRoleChange}
            />
          </main>

          <aside className="admin-right-column">
            <ActivityLogPanel logs={logs} />
            <div className="card admin-warn-card">
              <div className="panel-title">Future admin tools</div>
              <ul className="list">
                <li>Bulk moderation actions</li>
                <li>Review comments and recipes</li>
                <li>User suspension workflow</li>
                <li>Advanced analytics charts</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
