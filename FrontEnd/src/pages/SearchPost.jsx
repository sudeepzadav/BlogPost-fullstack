import { useState } from "react";
import Post from "../components/Post";
import usePagination from "../utils/usePagination";
import { useSearchParams } from "react-router-dom";

const SearchPost = () => {
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("q");
  console.log(search);
  const { posts, hasMore, totalPosts } = usePagination(
    "post/search-post",
    { search },
    1,
    page,
  );
  return (
    <>
      <h1 className="text-4xl text-gray-500 font-bold">
        Result for <span>{search}</span>
        {posts.length > 0 && <span>({totalPosts})</span>}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {posts.length === 0 ? (
          <span>No Post Found</span>
        ) : (
          <>
            {posts.map((post) => (
              <Post post={post} key={post._id} />
            ))}
          </>
        )}
      </div>
      {hasMore && totalPosts !== 0 && (
        <button onClick={() => setPage((prev) => prev + 1)}>Load more</button>
      )}
    </>
  );
};

export default SearchPost;