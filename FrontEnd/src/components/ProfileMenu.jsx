import { useState } from "react";
import { FiLogOut, FiTrash2, FiChevronDown } from "react-icons/fi";
import Button from "./Button";

const ProfileMenu = ({ name, loading, handleLogout, handleDeleteUser }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" tabIndex={0}>
      {/* Profile Button */}
      <Button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm transition-all duration-200 hover:border-blue-500 hover:shadow-md"
      >
        <div className="h-9 w-9 overflow-hidden rounded-full">
          <img
            src="https://www.imgonline.com.ua/examples/rainbow-background-1-preview.jpg"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>

        <span className="font-medium capitalize text-gray-700">{name}</span>

        <FiChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 mt-3 w-64 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl transition-all duration-200 z-50 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="border-b px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-gray-400">
            Signed in as
          </p>
          <p className="mt-1 truncate font-semibold capitalize text-gray-800">
            {name}
          </p>
        </div>

        {/* Menu */}
        <div className="p-2">
          <Button
            onClick={() => {
              handleLogout();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition hover:bg-blue-500"
          >
            <FiLogOut size={18} />
            Logout
          </Button>

          <Button
            onClick={() => {
              handleDeleteUser();
              setOpen(false);
            }}
            disabled={loading}
            className="mt-1 flex w-full items-center gap-3 rounded-lg bg-red-600 px-4 py-3 transition hover:bg-red-700 disabled:opacity-60"
          >
            <FiTrash2 size={18} />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;