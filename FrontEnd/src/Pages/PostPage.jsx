import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { MdInsertComment } from "react-icons/md";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  addselectedPost,
  changeLike,
  removeselectedPost,
} from "../utils/selectedPostSlice";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";

const PostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, email, id: userId } = useSelector((slice) => slice.user);
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(false);
  const { isOpen } = useSelector((slice) => slice.comment);
  const [isLike, setLike] = useState(false);
  const { likes } = useSelector((slice) => slice.post);
  async function fetchPostById() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/post/${id}`,
      );

      setPostData(response.data.post);
      if (response.data.post.likes.includes(userId)) {
        setLike(true);
      }
      dispatch(addselectedPost(response.data.post));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load post");
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/post/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message);
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  }

  async function handleLike() {
    if (token) {
      setLike((prev) => !prev);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/post/like/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(changeLike(userId));
        toast.success(response.data.message);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load post");
      }
    } else {
      return toast.error("Please signin for like this post");
    }
  }
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPostById();
    return () => {
      if (window.location.pathname !== `/edit-post/${id}`) {
        dispatch(removeselectedPost());
      }
    };
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="bg-base-200 min-h-screen py-10">
      <div className="max-w-8xl mx-auto px-4">
        {/* Card */}
        <div className="bg-base-100 rounded-3xl shadow-xl overflow-hidden">
          {/* Image */}
          <img
            src={postData.image}
            alt={postData.title}
            className="w-full h-112 object-cover"
          />

          {/* Content */}
          <div className="p-8">
            {/* Title */}
            <h1 className="text-4xl font-bold leading-tight">
              {postData.title}
            </h1>

            {/* Author */}
            <div className="flex items-center gap-3 mt-5 text-gray-500">
              <div className="h-9 w-9 overflow-hidden rounded-full">
                <img
                  src="https://www.imgonline.com.ua/examples/rainbow-background-1-preview.jpg"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <p className="font-semibold text-base-content">
                  {postData.creator?.name}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-8 text-lg leading-8 whitespace-pre-wrap">
              {postData.description}
            </div>

            {/* Like & Comment */}
            <div className="border-t mt-10 pt-6 flex gap-10"></div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <div className="flex items-center gap-2 text-xl">
                {isLike ? (
                  <AiFillLike
                    className="text-3xl text-blue-500 "
                    onClick={handleLike}
                  />
                ) : (
                  <AiOutlineLike className="text-3xl " onClick={handleLike} />
                )}
                <span>{likes?.length}</span>
              </div>

              <div className="flex items-center gap-2 text-xl">
                <MdInsertComment
                  className="text-green-500 text-3xl"
                  onClick={() => dispatch(setIsOpen())}
                />
                <span>{postData.comments?.length}</span>
              </div>
              {token && email === postData.creator?.email && (
                <>
                  <Link to={`/edit-post/${postData.postId}`}>
                    <Button className="rounded-xl px-6">
                      <span className="flex items-center gap-2">
                        <FiEdit2 />
                        Update
                      </span>
                    </Button>
                  </Link>
                  <Button
                    loading={loading}
                    className="bg-red-500 hover:bg-red-600 rounded-xl px-6 max-w-28"
                    onClick={handleDelete}
                  >
                    <span className="flex items-center gap-2 ">
                      <FiTrash2 />
                      Delete
                    </span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isOpen && <Comment />}
    </div>
  );
};

export default PostPage;
