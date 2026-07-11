import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { setComments } from "../utils/selectedPostSlice";

function Comment() {
     const dispatch = useDispatch();
     const [comment, setComment] = useState("");
     const { _id: postId, comments } = useSelector((state) => state.post);
     const { token } = useSelector((state) => state.user);
     const addComment = async () => {
          try {
               const res = await axios.post(`${import.meta.env.VITE_API_URL}/post/comment/${postId}`,
                    { comment },
                    {
                         headers: {
                              Authorization: `Bearer ${token}`,
                         }
                    })
               dispatch(setComments(res.data.createComment))
               toast.success(res.data.message);
               setComment("")

          } catch (error) {
               toast.error(error.response.data.message);
          }
     }
     const updateComment = async () => { }
     const deleteComment = async () => { }
     const likeComment = async (commentId) => {
          try {

          } catch (error) {
               toast.error(error.response.data.message);
          }
     }
     return (
          <>
               <div className="fixed top-0 right-0 h-screen w-105 bg-gray-50 shadow-2xl border-l z-50 flex flex-col">

                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b px-6 py-5 flex items-center justify-between">
                         <h2 className="text-xl font-bold">
                              Comments <span className="text-green-600">({comments?.length})</span>
                         </h2>

                         <button className="p-2 rounded-full hover:bg-gray-100 transition">
                              <IoMdClose className="text-2xl"
                                   onClick={() => dispatch(setIsOpen())}
                              />
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

                         <button onClick={addComment} className="mt-4 bg-green-600 hover:bg-green-700 transition text-white px-6 py-3 rounded-lg font-semibold">
                              Post Comment
                         </button>

                    </div>

                    {/* Comments */}
                    <div className="flex-1 overflow-y-auto px-5 py-3 space-y-5">

                         {comments.map((c) => (
                              <div
                                   key={c._id}
                                   className="bg-white rounded-2xl shadow-sm border p-4 hover:shadow-md transition"
                              >

                                   {/* Top */}
                                   <div className="flex justify-between">

                                        <div className="flex gap-3">

                                             <img
                                                  src="https://i.pravatar.cc/150?img=10"
                                                  alt=""
                                                  className="w-12 h-12 rounded-full object-cover"
                                             />

                                             <div>
                                                  <h3 className="font-semibold text-gray-800">
                                                       {c.user.name}
                                                  </h3>

                                                  <p className="text-sm text-gray-500">
                                                       12 June 2025
                                                  </p>
                                             </div>

                                        </div>

                                        <div className="p-2 rounded-full hover:bg-gray-100">
                                             <div className="mt-3 flex gap-3">
                                                  <button className="text-blue-600 hover:underline">
                                                       Edit
                                                  </button>

                                                  <button className="text-red-600 hover:underline">
                                                       Delete
                                                  </button>
                                             </div>
                                        </div>

                                   </div>

                                   {/* Comment */}
                                   <p className="mt-4 text-gray-700 leading-7">
                                        This article is really amazing. I learned a lot from it.
                                        Thanks for sharing such helpful content.
                                   </p>

                                   {/* Footer */}
                                   <div className="mt-5 flex items-center gap-3">

                                        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700">

                                             <AiFillLike className="text-2xl" />

                                             <span className="font-medium">
                                                  24
                                             </span>

                                        </button>

                                   </div>

                              </div>
                         ))}

                    </div>

               </div>
          </>
     );
}

export default Comment;