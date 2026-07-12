import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { setComments } from "../utils/selectedPostSlice";
import CommentItem from "./CommentItem";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const { _id: postId, comments } = useSelector((state) => state.post);
  const { token } = useSelector((state) => state.user);

  const addComment = async () => {
    if (!comment.trim()) return toast.error("Comment required");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post/comment/${postId}`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.createComment) {
        dispatch(setComments(res.data.createComment));
      }
      toast.success(res.data.message);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  const validComments = comments?.filter(Boolean) || [];

  return (
    <div className="fixed top-0 right-0 h-screen w-105 bg-gray-50 shadow-2xl border-l z-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Comments <span className="text-green-600">({validComments.length})</span>
        </h2>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <IoMdClose className="text-2xl" onClick={() => dispatch(setIsOpen())} />
        </button>
      </div>

      {/* Add Comment */}
      <div className="bg-white p-5 border-b">
        <textarea
          value={comment}
          placeholder="Write your comment..."
          className="w-full h-32 rounded-xl border border-gray-300 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={addComment}
          className="mt-4 bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-semibold"
        >
          Post Comment
        </button>
      </div>

      {/* Comments */}
      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">
        {validComments.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mt-10">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          validComments.map((c) => (
            <CommentItem key={c._id} comment={c} postId={postId} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}

export default Comment;