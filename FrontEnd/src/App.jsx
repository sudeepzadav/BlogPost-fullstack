import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/edit-post/:id" element={<AddPost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/signup" element={<Auth type="signup" />} />
          <Route path="/signin" element={<Auth type="signin" />} />
          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyUser />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;