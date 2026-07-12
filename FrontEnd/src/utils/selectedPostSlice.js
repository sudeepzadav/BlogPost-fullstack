import { createSlice } from "@reduxjs/toolkit";

// recursively find a comment/reply node by id, anywhere in the tree
function findCommentRecursive(nodes, id) {
  for (const node of nodes) {
    if (node._id === id) return node;
    if (node.replies?.length) {
      const found = findCommentRecursive(node.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// recursively remove a node by id, decrementing its parent's repliesCount
function removeCommentRecursive(nodes, id) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i]._id === id) {
      nodes.splice(i, 1);
      return true;
    }
    if (nodes[i].replies?.length) {
      const removed = removeCommentRecursive(nodes[i].replies, id);
      if (removed) {
        nodes[i].repliesCount = Math.max((nodes[i].repliesCount || 1) - 1, 0);
        return true;
      }
    }
  }
  return false;
}

const selectedPost = createSlice({
     name: "selectedPost",
     initialState: JSON.parse(localStorage.getItem("selectedPost")) || {},
     reducers: {
          addselectedPost(state, action) {
               localStorage.setItem("selectedPost", JSON.stringify(action.payload))
               return action.payload;
          },
          removeselectedPost(state, action) {
               localStorage.removeItem("selectedPost")
               return {}
          },
          changeLike(state, action) {
               if (state.likes.includes(action.payload)) {
                    state.likes = state.likes.filter((like) => like !== action.payload);
               } else {
                    state.likes = [...state.likes, action.payload];
               }
               return state;
          },
          setComments(state, action) {
               state.comments = [action.payload, ...state.comments,];
          },
          // 👇 now recursive — works for a top-level comment OR a reply at any depth
          setCommentsLikes(state, action) {
               const { commentId, userId } = action.payload;
               const comment = findCommentRecursive(state.comments, commentId);
               if (comment) {
                    if (comment.likes.includes(userId)) {
                         comment.likes = comment.likes.filter((like) => like !== userId);
                    } else {
                         comment.likes = [...comment.likes, userId];
                    }
               }
          },
          // 👇 now recursive
          deleteComments(state, action) {
               removeCommentRecursive(state.comments, action.payload);
          },
          // 👇 now recursive
          updateComments(state, action) {
               const { commentId, newComment } = action.payload;
               const comment = findCommentRecursive(state.comments, commentId);
               if (comment) {
                    comment.message = newComment;
               }
          },
          // set/replace the replies of ANY node (top-level comment or a reply) by id
          setReplies(state, action) {
               const { commentId, replies } = action.payload;
               const comment = findCommentRecursive(state.comments, commentId);
               if (comment) {
                    comment.replies = replies;
                    comment.repliesOpen = true;
               }
          },
          // append a freshly posted reply under ANY node, at any depth
          addReply(state, action) {
               const { parentId, reply } = action.payload;
               const parent = findCommentRecursive(state.comments, parentId);
               if (parent) {
                    parent.replies = parent.replies
                         ? [...parent.replies, reply]
                         : [reply];
                    parent.repliesCount = (parent.repliesCount || 0) + 1;
                    parent.repliesOpen = true;
               }
          },
     },
});
export const {
     addselectedPost,
     removeselectedPost,
     changeLike,
     setComments,
     setCommentsLikes,
     deleteComments,
     updateComments,
     setReplies,
     addReply,
} = selectedPost.actions;
export default selectedPost.reducer;