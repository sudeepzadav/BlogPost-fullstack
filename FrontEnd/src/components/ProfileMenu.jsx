import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { FiLogOut, FiTrash2, FiChevronDown } from "react-icons/fi";

const ProfileMenu = ({ name, loading, handleLogout, handleDeleteUser }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useSelector((state) => state.user);

  const handleDashboard = () => {
    if (role === "admin") {
      navigate("/admin/dashboard"); // adjust to your actual admin route
    } else {
      navigate("/dashboard"); // adjust to your actual user route
    }
    setOpen(false);
  };

  return (
    <div className="relative" tabIndex={0}>
      {/* Profile Button */}
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-200 ${
          open
            ? "border-violet-400/40 bg-white/10"
            : "border-white/10 bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-violet-400/30">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        <span className="font-medium capitalize text-indigo-50">
          {name}
        </span>

        <FiChevronDown
          size={14}
          className={`text-indigo-300 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-200 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="border-b border-slate-100 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Signed in as
          </p>
          <p className="mt-1 truncate font-semibold capitalize text-slate-800">
            {name}
          </p>
        </div>

        {/* Menu */}
        <div className="p-2">
          <Button
            onClick={handleDashboard}
            className="flex justify-center px-4 py-3 mb-1 bg-purple-400"
          >
            Dashboard
          </Button>

          <Button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <FiLogOut size={15} />
            Logout
          </Button>

          <Button
            onClick={() => {
              handleDeleteUser();
              setOpen(false);
            }}
            disabled={loading}
            className="mt-1 flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <FiTrash2 size={15} />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;