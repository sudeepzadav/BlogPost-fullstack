import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const [userData, setUserData] = useState({ newPassword: "" });
  const navigate = useNavigate();
const { token } = useParams();

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!userData.newPassword) {
      toast.error("Please enter your newPassword");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/reset-password/${token}`,
        { newPassword: userData.newPassword },
      );
      toast.success(res.data.message);
      setUserData({ newPassword: "" });
      navigate("/signin");
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

            <input
              type="password"
              placeholder="Enter your new password"
              value={userData.newPassword}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  newPassword: e.target.value,
                })
              }
              className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;