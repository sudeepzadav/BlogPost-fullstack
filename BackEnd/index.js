require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./config/connectDb");
const userRoutes = require("./router/userRouter");
const postRoutes = require("./router/postRouter");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Server connected Succesfully" });
});
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);

app.listen(PORT, () => {
  console.log(`server started ${PORT}`);
  connectDb();
});