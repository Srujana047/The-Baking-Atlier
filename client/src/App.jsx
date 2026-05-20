import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import AdminRoute from "./components/routing/AdminRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import HomePage from "./pages/HomePage.jsx";
import Contact from "./pages/Contact.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import RecipesPage from "./pages/RecipesPage.jsx";
import CreateRecipePage from "./pages/CreateRecipePage.jsx";
import RecipeDetailPage from "./pages/RecipeDetailPage.jsx";
import EditRecipePage from "./pages/EditRecipePage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app-shell">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Phase 3: Recipe Routes */}
              <Route path="/recipes" element={<RecipesPage />} />
              <Route
                path="/recipes/create"
                element={
                  <ProtectedRoute>
                    <CreateRecipePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/recipes/:recipeId" element={<RecipeDetailPage />} />

              {/* Lightweight recipe edit route (Phase 3) */}
              <Route
                path="/recipes/:recipeId/edit"
                element={
                  <ProtectedRoute>
                    <EditRecipePage />
                  </ProtectedRoute>
                }
              />

              {/* TODO: add community pages once the Phase 4 community flow is stable */}
              {/* <Route path="/community" element={<CommunityPage />} /> */}

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboardPage />
                  </AdminRoute>
                }
              />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* TODO: add admin-only routes foundation once admin pages exist */}
              { /*<Route path="/admin" element={<AdminRoute><AdminPage/></AdminRoute>} /> */}

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

