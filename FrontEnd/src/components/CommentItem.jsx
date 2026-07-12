import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { AiFillLike } from "react-icons/ai";
import { FiCornerDownRight, FiChevronDown } from "react-icons/fi";
import {
  deleteComments,
  updateComments,
  setCommentsLikes,
  setReplies,
  addReply,
} from "../utils/selectedPostSlice";

const MAX_INDENT = 6;

function CommentItem({ comment, postId, depth = 0 }) {
  if (!comment) return null; // 👈 guard against holes in the array

  const dispatch = useDispatch();
  const { token, id: userId } = useSelector((state) => state.user);

  const [editing, setEditing] = useState(false);
  const [editingMessage, setEditingMessage] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loadingReplies, setLoadingReplies] = useState(false);

  const c = comment;

  const updateComment = async () => {
    if (!editingMessage.trim()) return toast.error("Comment required");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/post/comment/${c._id}`,
        { message: editingMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(updateComments({ commentId: c._id, newComment: editingMessage }));
      setEditing(false);
      toast.success(res?.data?.message || "Success");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update");
    }
  };

  const deleteComment = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/comment/${c._id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      dispatch(deleteComments(c._id));
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete");
    }
  };

  const likeComment = async () => {
    if (!token) return toast.error("Please signing for like this post");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/comment-like/${c._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      dispatch(setCommentsLikes({ commentId: c._id, userId }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like");
    }
  };

  const addReplyComment = async () => {
    if (!replyText.trim()) return toast.error("Reply required");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/comment/${postId}`,
        { comment: replyText, parentComment: c._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.createComment) {
        dispatch(addReply({ parentId: c._id, reply: res.data.createComment }));
      }
      toast.success(res.data.message);
      setReplyText("");
      setReplying(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reply");
    }
  };

  const toggleReplies = async () => {
    if (c.replies) {
      dispatch(setReplies({ commentId: c._id, replies: c.replies }));
      return;
    }
    setLoadingReplies(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/comment/${c._id}/replies`,
      );
      dispatch(setReplies({ commentId: c._id, replies: res.data.replies || [] }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load replies");
    } finally {
      setLoadingReplies(false);
    }
  };

  const indent = Math.min(depth, MAX_INDENT);
  const validReplies = c.replies?.filter(Boolean) || [];

  return (
    <div
      className={
        depth === 0
          ? "bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition"
          : "bg-gray-50 rounded-xl p-3"
      }
      style={{ marginLeft: depth > 0 ? 16 : 0 }}
    >
      {/* Top */}
      <div className="flex justify-between">
        <div className={`flex ${depth === 0 ? "gap-3" : "gap-2.5"}`}>
          <img
            src={`https://api.dicebear.com/9.x/initials/svg?seed=${c?.user?.name}`}
            alt=""
            className={
              depth === 0
                ? "w-12 h-12 rounded-full object-cover"
                : "w-8 h-8 rounded-full object-cover"
            }
          />
          <div>
            <h3
              className={
                depth === 0
                  ? "font-semibold text-gray-800"
                  : "text-sm font-semibold text-gray-800"
              }
            >
              {c?.user?.name}
            </h3>
            <p className={depth === 0 ? "text-sm text-gray-500" : "text-xs text-gray-500"}>
              {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
            </p>
          </div>
        </div>

        {c.user?._id === userId && (
          <div className="flex gap-3 text-sm">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => {
                setEditing(true);
                setEditingMessage(c.message);
              }}
            >
              Edit
            </button>
            <button onClick={deleteComment} className="text-red-600 hover:underline">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Message / edit box */}
      {editing ? (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3">
          <textarea
            value={editingMessage}
            onChange={(e) => setEditingMessage(e.target.value)}
            className="w-full min-h-20 resize-none rounded-lg border border-gray-300 p-2 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => setEditing(false)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={updateComment}
              className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className={depth === 0 ? "mt-3 font-medium text-lg" : "mt-2 text-sm text-gray-800"}>
          {c.message}
        </p>
      )}

      {/* Footer */}
      <div className="mt-3 flex items-center gap-4">
        <button className="flex items-center gap-1.5" onClick={likeComment}>
          <AiFillLike
            className={`${
              c?.likes?.includes(userId) ? "text-blue-500" : "text-gray-400"
            } cursor-pointer ${depth === 0 ? "text-2xl" : "text-base"}`}
          />
          <span className={depth === 0 ? "font-medium" : "text-xs font-medium text-gray-600"}>
            {c?.likes?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setReplying((v) => !v)}
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-green-600 transition"
        >
          <FiCornerDownRight size={14} />
          Reply
        </button>

        {(c.repliesCount > 0 || validReplies.length > 0) && (
          <button
            onClick={toggleReplies}
            disabled={loadingReplies}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 transition"
          >
            <FiChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                c.repliesOpen ? "rotate-180" : ""
              }`}
            />
            {loadingReplies
              ? "Loading..."
              : c.repliesOpen
              ? "Hide replies"
              : `View ${c.repliesCount ?? validReplies.length} repl${
                  (c.repliesCount ?? validReplies.length) === 1 ? "y" : "ies"
                }`}
          </button>
        )}
      </div>

      {/* Reply input */}
      {replying && (
        <div className="mt-3 pl-3 border-l-2 border-gray-200">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${c?.user?.name}...`}
            className="w-full h-16 rounded-lg border border-gray-300 p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              onClick={() => {
                setReplying(false);
                setReplyText("");
              }}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={addReplyComment}
              className="rounded-lg bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {/* Nested replies — recursive step */}
      {c.repliesOpen && validReplies.length > 0 && (
        <div className="mt-3 space-y-3">
          {validReplies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              depth={depth + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentItem;