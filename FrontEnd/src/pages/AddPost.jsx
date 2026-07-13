import { useEffect, useState } from "react";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addselectedPost, removeselectedPost } from "../utils/selectedPostSlice";

const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((slice) => slice.user);
  const { title, description, draft, image } = useSelector((slice) => slice.post);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    image: null,
    draft: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setPostData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };
  async function handleCreatePost() {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/post`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      if (postData.draft) {
        navigate("/draft-list");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleUpdatePost() {
    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/post/${id}`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      if (postData.draft) {
        navigate(`"/draft-post/${id}`);
      } else {
        navigate(`/post/${id}`);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchByPost() {
    setPostData({ title, description, draft, image })

  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!token) return navigate("/signin");
    if (id) fetchByPost()
    return () => {
      if (window.location.pathname !== `/edit-post/${id}`) {
        dispatch(removeselectedPost())
      }
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className="w-full  p-6">
      <div className="w-full bg-white rounded-2xl shadow-lg">
        {/* Header */}
        <div className="border-b px-8 py-6">
          <h1 className="text-3xl font-bold">{id ? "Update" : "Create New"} Post</h1>
          <p className="text-gray-500 mt-1">
            Fill in the details below to create a new blog post.
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={postData.title}
              onChange={handleChange}
              placeholder="Enter post title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={8}
              value={postData.description}
              onChange={handleChange}
              placeholder="Write your post..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="block mb-2 font-medium text-gray-700"
            >
              Featured Image
            </label>

            <label
              htmlFor="image"
              className=" overflow-hidden w-full h-72 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition"
            >
              <span className="text-lg font-medium text-gray-600">
                {postData.image ? (
                  <img
                    src={typeof postData.image == "string" ? postData.image : URL.createObjectURL(postData.image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Click to upload image"
                )}
              </span>

              <span className="text-sm text-gray-400 mt-2">JPG, PNG, JPEG</span>
            </label>

            <input
              id="image"
              name="image"
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleChange}
            />
          </div>

          {/* Draft */}
          <div className="flex items-center gap-3">
            <input
              id="draft"
              name="draft"
              type="checkbox"
              checked={postData.draft}
              onChange={handleChange}
              className="checkbox checkbox-primary"
            />

            <label htmlFor="draft" className="cursor-pointer">
              Save as Draft
            </label>
          </div>

          {/* Button */}
          <Button
            loading={loading}
            onClick={id ? handleUpdatePost : handleCreatePost}
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            {id ? "Update" : "Create"} Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddPost;