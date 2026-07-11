import { createSlice } from "@reduxjs/toolkit";
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
          setComments(state, action){
               state.comments = [...state.comments, NavigationActivation.payload]
          },setCommentsLikes(state, action){
               let { commentId, userId } = action.payload;
               let comment = state.comments.find((comment) => comment._id == commentId);
               if(comment.likes.include(userId)) {
                    comment.likes = [...comment.likes, userId]
               }
               return state;
          }
     },
});
export const { addselectedPost, removeselectedPost, changeLike, setComments } = selectedPost.actions;
export default selectedPost.reducer;