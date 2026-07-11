import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
function usePagination(path, queryParams = {}, limit, page) {
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/${path}`, {
          params: { ...queryParams, limit, page },
        });
        setPosts((prev) =>
          page == 1 ? res.data.posts : [...prev, ...res.data.posts],
        );
        setHasMore(res.data.hasMore);
        setTotalPosts(res.data.totalPosts);
        toast.success(res.data.message);
      } catch (error) {
        setPosts([]);
        toast.error(error.response.data.message);
        console.error(error);
      }
    }
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, queryParams.search]);
  return { posts, hasMore, totalPosts };
}

export default usePagination;