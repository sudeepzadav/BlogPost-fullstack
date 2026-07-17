import { useState } from "react";
import Post from "../components/Post";
import usePagination from "../utils/usePagination";

const Home = () => {
  const [page, setPage] = useState(1);
  const { posts, hasMore } = usePagination("post", {}, 8, page);

  return (
    <div className="h-[calc(100vh-9rem)] overflow-y-auto overflow-x-hidden bg-slate-50 scrollbar-hide">
      <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {posts.map((post) => (
          <Post post={post} key={post._id} />
        ))}
      </div>

      {hasMore && (
        <div className="my-8 flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-full border border-violet-200 bg-white px-6 py-2.5 text-sm font-medium text-violet-700 shadow-sm transition hover:border-violet-300 hover:bg-violet-50 active:scale-95"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;