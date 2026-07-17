import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const DraftList = () => {
  const navigate = useNavigate();
  const { token } = useSelector((slice) => slice.user);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchDrafts() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/my-drafts`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setDrafts(res.data.posts);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load drafts");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(postId) {
    setDeletingId(postId);
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success(res.data.message);
      setDrafts((prev) => prev.filter((d) => d.postId !== postId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete draft");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    if (!token) return navigate("/signin");
    fetchDrafts();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full p-6">
      <div className="w-full bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="border-b px-8 py-6">
          <h1 className="text-3xl font-bold">Your Drafts</h1>
          <p className="text-gray-500 mt-1">
            Posts you've started but haven't published yet.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <p className="text-gray-500">Loading drafts...</p>
          ) : drafts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No drafts yet.</p>
              <p className="text-gray-400 mt-1">
                Start writing and save as draft to see it here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((post) => (
                <div
                  key={post._id}
                  className="flex items-center gap-4 border border-gray-200 rounded-xl p-4 hover:border-blue-400 transition"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold truncate">
                      {post.title || "Untitled draft"}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {post.description}
                    </p>
                    <p className="text-gray-400 text-xs mt-2">
                      Last edited{" "}
                      {new Date(post.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/edit-post/${post.postId}`)}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.postId)}
                      disabled={deletingId === post.postId}
                      className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {deletingId === post.postId ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftList;
