import { useState } from "react";
import Post from "../components/Post";
import usePagination from "../utils/usePagination";

const Home = () => {
  const [page, setPage] = useState(1);
  const { posts, hasMore } = usePagination("post", {}, 2, page);
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>
      {hasMore && (
        <button onClick={() => setPage((prev) => prev + 1)}>Load more</button>
      )}
    </>
  );
};

export default Home;