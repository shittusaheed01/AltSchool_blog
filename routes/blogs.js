const express = require("express");
const passport = require("passport");

const blogRouter = express.Router();
const {
  getBlogs,
  getBlog,
  postBlog,
  updateBlog,
  deleteBlog,
  getBookmarks,
  getMyBlog,
  addBookmark,
} = require("../controllers/blogControl");

const { verifyBlogOwner } = require("../middleware/middlewares");
const { PostBlogValidation, UpdateBlogValidation } = require("../middleware/validators/blog.validator.js");

blogRouter.get("/", getBlogs);

blogRouter.get(
  "/bookmark",
  passport.authenticate("jwt", {session: false,}),
  getBookmarks
);
blogRouter.post(
  "/bookmark:id",
  passport.authenticate("jwt", {session: false,}),
  addBookmark
);
blogRouter.get(
  "/me",
  passport.authenticate("jwt", {session: false,}),
  getMyBlog
);

blogRouter.get("/:id", getBlog)

blogRouter.patch(
  "/:id",
    UpdateBlogValidation,
    passport.authenticate("jwt", {session: false}),
    verifyBlogOwner,
    updateBlog
);
blogRouter.post(
  "/",
    PostBlogValidation,
    passport.authenticate("jwt", {session: false }),
    postBlog
);
blogRouter.delete(
  "/:id",
  passport.authenticate("jwt", {session: false,}),
  verifyBlogOwner,
  deleteBlog
);

module.exports = blogRouter;
