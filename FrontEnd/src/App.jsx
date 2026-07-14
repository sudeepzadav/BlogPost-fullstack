import { Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Auth from "./components/Auth";
import Layout from "./Layout";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import AddPost from "./pages/AddPost";
import VerifyUser from "./pages/VerifyUser";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SearchPost from "./pages/SearchPost";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { token, role } = useSelector((state) => state.user);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="search" element={<SearchPost />} />
        <Route path="post/:id" element={<PostPage />} />
        <Route path="signup" element={<Auth type="signup" />} />
        <Route path="signin" element={<Auth type="signin" />} />
        <Route
          path="verify-email/:verificationToken"
          element={<VerifyUser />}
        />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="add-post"
          element={token ? <AddPost /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="edit-post/:id"
          element={token ? <AddPost /> : <Navigate to="/signin" replace />}
        />

        <Route
          path="dashboard"
          element={token ? <UserDashboard /> : <Navigate to="/signin" replace />}
        />

        {/* Admin Only */}
        <Route
          path="admin/dashboard"
          element={
            !token ? (
              <Navigate to="/signin" replace />
            ) : role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Route>
    </Routes>
  );
}

export default App;