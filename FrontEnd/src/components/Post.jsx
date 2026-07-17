import { Link } from "react-router-dom";

const STATUS_LABEL = {
  pending: "Pending admin approval",
  rejected: "Rejected",
};

const Post = ({ post }) => {
  const isViewable = post.status === "approved";

  const cardContent = (
    <>
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

        {!isViewable && (
          <div className="card-actions justify-between items-center">
            <span className="badge badge-warning">
              {STATUS_LABEL[post.status] || post.status}
            </span>

            <Link
              to={`/edit-post/${post.postId}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-outline btn-sm"
            >
              Edit
            </Link>
          </div>
        )}
      </div>
    </>
  );

  if (isViewable) {
    return (
      <Link
        to={`/post/${post.postId}`}
        key={post._id}
        className="card bg-base-100 w-full shadow-sm rounded-xl overflow-hidden"
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div
      key={post._id}
      className="card bg-base-100 w-full shadow-sm rounded-xl overflow-hidden cursor-default"
    >
      {cardContent}
    </div>
  );
};

export default Post;