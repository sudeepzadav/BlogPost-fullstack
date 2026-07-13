import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import Button from "../components/Button";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [userData, setUserData] = useState({ email: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!userData.email) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/forgot-password`,
        { email: userData.email },
      );
      toast.success(res.data.message);
      setUserData({ email: "" });
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
          Forgot Password
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <MdAlternateEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

            <input
              type="email"
              placeholder="Enter your registered email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              // required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg transition"
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;