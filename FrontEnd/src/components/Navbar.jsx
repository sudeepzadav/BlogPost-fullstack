import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../utils/userSlice";
import axios from "axios";
import ProfileMenu from "./ProfileMenu";
import { LiaPenNibSolid } from "react-icons/lia";
import { IoSearch } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, name, id } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState(null);
  const [loading, setLoading] = useState(false);

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
        },
      );
      dispatch(logout());
      toast.success(response.data.message);
      navigate("/signin");
    } catch (error) {
      toast.error("Failed to delete user:" + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    dispatch(logout());
    navigate("/signin");
  }

  return (
    <div className="sticky top-0 z-50 w-full h-17.5 bg-white border-b border-gray-200 shadow-sm">
      <div className="grid grid-cols-3 items-center h-full px-6">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link to={"/"}>
            <div className="text-2xl font-bold tracking-tight bg-linear-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent">
              Sklogin
            </div>
          </Link>
        </div>

        {/* Center - Search */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-colors"
              value={searchQuery ? searchQuery : ""}
              onChange={(e) => setSearchQuery(e.target.value.trimStart())}
              onKeyDown={(e) => {
                if (e.code === "Enter" && searchQuery?.trim()) {
                  navigate(`/search?q=${searchQuery.trim()}`);
                }
              }}
            />
            <IoSearch className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center justify-end gap-4">
          {token ? (
            <>
              <Link
                to={"/add-post"}
                className="flex items-center gap-2 text-gray-700 hover:text-amber-500 transition-colors"
              >
                <button className="flex items-center gap-1.5 text-lg font-medium">
                  <LiaPenNibSolid className="text-3xl" />
                  <span className="hidden sm:inline">Write</span>
                </button>
              </Link>
              <ProfileMenu
                name={name}
                loading={loading}
                handleLogout={handleLogout}
                handleDeleteUser={handleDeleteUser}
              />
            </>
          ) : (
            <>
              <Link to={"/signup"}>
                <button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-amber-600 transition-colors text-sm font-medium">
                  Signup
                </button>
              </Link>
              <Link to={"/signin"}>
                <button className="border border-gray-300 px-5 py-2 rounded-full hover:bg-amber-400 transition-colors text-sm font-medium">
                  Signin
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
