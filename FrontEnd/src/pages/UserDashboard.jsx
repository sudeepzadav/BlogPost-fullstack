import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus, FiFileText } from "react-icons/fi";
import Post from "../components/Post";

const FILTERS = ["all", "approved", "pending", "rejected"];

const STATUS_STYLES = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { token, name, email } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [draftsOnly, setDraftsOnly] = useState(false);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/my-posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts(res.data.posts || res.data.myPosts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/signin");
    fetchMyPosts();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Delete this post? This cannot be undone.")) return;

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message);
      setPosts((prev) => prev.filter((p) => p.postId !== postId && p._id !== postId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const handleEdit = (e, postId) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-post/${postId}`);
  };

  const filteredPosts = posts.filter((p) => {
    if (draftsOnly && !p.draft) return false;
    if (!draftsOnly && p.draft) {
      // still show drafts inside "all" if you want, otherwise uncomment below to hide drafts from normal view
      // return false;
    }
    if (filter === "all") return true;
    return p.status === filter;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? posts.length : posts.filter((p) => p.status === f).length;
    return acc;
  }, {});

  return (
    <div className="w-full p-6 mx-auto">
      {/* Profile header */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-lg p-8 flex items-center justify-between flex-wrap gap-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${name}`}
            alt="Profile"
            className="h-16 w-16 rounded-full ring-4 ring-white/30"
          />
          <div>
            <h1 className="text-2xl font-bold capitalize">{name}</h1>
            <p className="text-indigo-100">{email}</p>
            <p className="text-sm text-indigo-200 mt-1">
              {posts.length} total posts · {posts.filter((p) => p.draft).length} drafts
            </p>
          </div>
        </div>

        <Link
          to="/add-post"
          className="flex items-center gap-2 bg-white text-indigo-700 hover:bg-indigo-50 transition px-5 py-3 rounded-xl font-semibold shadow"
        >
          <FiPlus size={18} />
          Create Post
        </Link>
      </div>

      {/* Status filter pills + drafts toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 mt-8 mb-6">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition flex items-center gap-2 ${
                filter === f
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  filter === f ? "bg-white/20" : "bg-gray-100 text-gray-500"
                }`}
              >
                {counts[f]}
              </span>
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none bg-white border border-gray-200 rounded-full px-4 py-2">
          <input
            type="checkbox"
            checked={draftsOnly}
            onChange={(e) => setDraftsOnly(e.target.checked)}
            className="checkbox checkbox-sm checkbox-primary"
          />
          <FiFileText size={15} className="text-gray-500" />
          <span className="text-sm text-gray-600">Drafts only</span>
        </label>
      </div>

      {/* Posts grid */}
      <div className="max-h-80 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FiFileText size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No posts match this filter.</p>
            <p className="text-gray-400 text-sm mt-1">Try a different tab or create a new post.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div key={post._id} className="relative group">
                <Post post={post} />

                {/* Status badge */}
                {post.status && (
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                      STATUS_STYLES[post.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {post.status}
                  </span>
                )}
                {post.draft && (
                  <span className="absolute top-3 left-3 mt-7 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-800 text-white">
                    Draft
                  </span>
                )}

                {/* Edit / Delete */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => handleEdit(e, post.postId || post._id)}
                    className="p-2 rounded-full bg-white shadow hover:bg-blue-50 text-blue-600"
                    title="Edit"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, post.postId || post._id)}
                    className="p-2 rounded-full bg-white shadow hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;