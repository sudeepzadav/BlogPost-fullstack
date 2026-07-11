import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import Button from "./Button";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const Auth = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleForm(e) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/${type}`,
        data,
      );
      toast.success(res.data.message);
      if (type === "signin") {
        dispatch(login(res.data.user));
        navigate("/");
      } else {
        navigate("/signin");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-linear-to-br from-pink-500 via-white to-blue-500">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-sm w-full p-8 text-left text-sm rounded-2xl shadow-xl shadow-indigo-100 border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {type === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 mt-2 text-sm">
            {type === "signup"
              ? "Sign up to get started"
              : "Sign in to continue"}
          </p>
        </div>

        {type === "signup" && (
          <div className="mb-4">
            <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl gap-2 px-3.5 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent focus-within:bg-white transition-all">
              <FiUser className="text-gray-400 shrink-0" size={18} />
              <input
                className="w-full outline-none bg-transparent py-3 placeholder:text-gray-400"
                type="text"
                name="name"
                placeholder="Username"
                onChange={handleForm}
                required
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl gap-2 px-3.5 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent focus-within:bg-white transition-all">
            <FiMail className="text-gray-400 shrink-0" size={18} />
            <input
              className="w-full outline-none bg-transparent py-3 placeholder:text-gray-400"
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleForm}
              required
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl gap-2 px-3.5 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent focus-within:bg-white transition-all">
            <FiLock className="text-gray-400 shrink-0" size={18} />
            <input
              className="w-full outline-none bg-transparent py-3 placeholder:text-gray-400"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleForm}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {type === "signin" && (
          <div className="text-right text-sm mb-6">
            <Link
              to="/forgot-password"
              className="text-indigo-500 hover:text-indigo-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          className={`w-full ${
            type === "signin" ? "mt-2" : "mt-8"
          } mb-4 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-3 rounded-xl text-white font-medium shadow-md shadow-indigo-200`}
        >
          {type === "signup" ? "Create Account" : "Login"}
        </Button>

        {type === "signup" ? (
          <p className="text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/signin" className="text-indigo-500 font-medium hover:underline">
              Log In
            </Link>
          </p>
        ) : (
          <p className="text-center text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-500 font-medium hover:underline">
              Create Account
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Auth;