import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => {
  const location = useLocation();
  const { role } = useSelector((state) => state.user);

  const hideNavbar =
    ["/signin", "/signup", "/forgot-password"].includes(location.pathname) ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/verify-email");

 
  if (role === "admin" && location.pathname !== "/admin/dashboard") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;