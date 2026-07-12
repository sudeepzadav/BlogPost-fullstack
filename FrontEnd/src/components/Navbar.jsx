import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../utils/userSlice";
import axios from "axios";
import ProfileMenu from "./ProfileMenu";
import { FaPenNib, FaSearch } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, name, id } = useSelector((state) => state.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  async function handleDeleteUser() {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    setLoading(true);

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(logout());
      toast.success(response.data.message);
      navigate("/signin");
    } catch (error) {
      toast.error(
        "Failed to delete user: " + (error.response?.data?.message || "")
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/signin");
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  };

  return (
    <div className="sticky top-0 z-50 flex h-16 w-full items-center justify-between bg-[#1E1B4B] px-6 shadow-lg shadow-indigo-950/20">
      {/* Left Side */}
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="bg-linear-to-r from-violet-300 via-indigo-200 to-violet-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            SkLogin
          </h1>
        </Link>

        {/* Search */}
        <div
          className={`flex w-80 items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200 ${
            searchFocused
              ? "border-violet-400 bg-white/10 shadow-[0_0_0_4px_rgba(167,139,250,0.15)]"
              : "border-white/10 bg-white/5 hover:bg-white/8"
          }`}
        >
          <FaSearch
            size={13}
            className={`shrink-0 transition-colors ${
              searchFocused ? "text-violet-300" : "text-indigo-300/60"
            }`}
          />
          <input
            type="text"
            placeholder="Search articles..."
            className="w-full bg-transparent text-sm text-indigo-50 placeholder:text-indigo-300/50 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.trimStart())}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link
              to="/add-post"
              className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-indigo-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <FaPenNib
                size={13}
                className="transition-transform duration-200 group-hover:-rotate-6"
              />
              <span>Write</span>
            </Link>

            <div className="h-6 w-px bg-white/10" />

            <ProfileMenu
              name={name}
              loading={loading}
              handleLogout={handleLogout}
              handleDeleteUser={handleDeleteUser}
            />
          </>
        ) : (
          <>
            <Link to="/signin">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-indigo-200 transition-colors duration-200 hover:text-white">
                Sign in
              </button>
            </Link>

            <Link to="/signup">
              <button className="rounded-full bg-linear-to-r from-violet-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-violet-900/40 active:scale-[0.98]">
                Sign up
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;