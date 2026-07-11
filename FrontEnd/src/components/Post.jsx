import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <Link
      to={`/post/${post.postId}`}
      key={post._id}
      className="card bg-base-100 w-full shadow-sm rounded-xl overflow-hidden"
    >
      <figure className="h-56">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="card-body px-2">
        <h2 className="card-title line-clamp-1">{post.title}</h2>
        <p className="line-clamp-3">{post.description}</p>

        <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </Link>
  );
};

export default Post;