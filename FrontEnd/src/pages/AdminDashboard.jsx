import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiFileText,
  FiClock,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";

const TABS = ["overview", "pending", "approved", "rejected", "users"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token, role } = useSelector((state) => state.user);

  const [tab, setTab] = useState("overview");
  const [pendingPosts, setPendingPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchPending = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/admin/pending`,
        authHeader,
      );
      setPendingPosts(res.data.posts || res.data.pendingPosts || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load pending posts",
      );
    }
  };

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post`,
        authHeader,
      );
      setAllPosts(res.data.posts || res.data.post || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/user`,
        authHeader,
      );
      setUsers(res.data.users || res.data.user || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchPending(), fetchAllPosts(), fetchUsers()]);
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return navigate("/signin");
    if (role !== "admin") return navigate("/");
    loadAll();
    // eslint-disable-next-line
  }, []);

  const handleStatusUpdate = async (postId, status) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/post/admin/${postId}/status`,
        { status },
        authHeader,
      );
      toast.success(res.data.message || `Post ${status}`);

      const updatedPost = res.data.post;

      setPendingPosts((prev) => prev.filter((p) => p._id !== postId));

      setAllPosts((prev) => {
        const alreadyExists = prev.some((p) => p._id === postId);
        if (alreadyExists) {
          return prev.map((p) => (p._id === postId ? { ...p, status } : p));
        }
        return [...prev, updatedPost];
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/user/${userId}`,
        authHeader,
      );
      toast.success(res.data.message || "User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const approvedPosts = allPosts.filter((p) => p.status === "approved");
  const rejectedPosts = allPosts.filter((p) => p.status === "rejected");

  const PostRow = ({ post, showActions }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <img
        src={post.image}
        alt={post.title}
        className="h-16 w-16 rounded-lg object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold truncate">{post.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{post.description}</p>
        <p className="text-xs text-gray-400 mt-1">
          by {post.creator?.name || post.user?.name || "unknown"}
        </p>
      </div>
      {showActions && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => handleStatusUpdate(post._id, "approved")}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
          >
            <FiCheck size={15} />
            Approve
          </button>
          <button
            onClick={() => handleStatusUpdate(post._id, "rejected")}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
            <FiX size={15} />
            Reject
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full p-6 mx-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl shadow-lg p-8 text-white">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-slate-300 mt-1">
          Manage posts and users across the platform.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-yellow-100 flex items-center justify-center">
            <FiClock className="text-yellow-600" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingPosts.length}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center">
            <FiCheck className="text-green-600" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{approvedPosts.length}</p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-red-100 flex items-center justify-center">
            <FiX className="text-red-600" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{rejectedPosts.length}</p>
            <p className="text-sm text-gray-500">Rejected</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-blue-100 flex items-center justify-center">
            <FiUsers className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-2xl font-bold">{users.length}</p>
            <p className="text-sm text-gray-500">Users</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-8 mb-6 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full font-medium capitalize transition ${
              tab === t
                ? "bg-slate-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t}
            {t === "pending" && pendingPosts.length > 0 && (
              <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">
                {pendingPosts.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : tab === "overview" ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          Overview stats are shown above. Switch tabs to take action.
        </div>
      ) : tab === "pending" ? (
        <div className="max-h-36 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          {pendingPosts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No posts awaiting approval.
            </p>
          ) : (
            pendingPosts.map((post) => (
              <PostRow key={post._id} post={post} showActions />
            ))
          )}
        </div>
      ) : tab === "approved" ? (
        <div className="max-h-55 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          {approvedPosts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No approved posts yet.
            </p>
          ) : (
            approvedPosts.map((post) => (
              <PostRow key={post._id} post={post} showActions={false} />
            ))
          )}
        </div>
      ) : tab === "rejected" ? (
        <div className="max-h-36 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          {rejectedPosts.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No rejected posts.
            </p>
          ) : (
            rejectedPosts.map((post) => (
              <PostRow key={post._id} post={post} showActions={false} />
            ))
          )}
        </div>
      ) : (
        <div className="max-h-36 overflow-y-auto bg-white rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Name
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Email
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500">
                  Role
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-400 py-10">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-3 capitalize">{u.name}</td>
                    <td className="px-5 py-3 text-gray-500">{u.email}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-600"
                          title="Delete user"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;