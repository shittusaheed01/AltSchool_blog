const express = require("express");
const passport = require("passport");

const blogRouter = express.Router();
const {
  getBlogs,
  getbyIDBlog,
  postBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
} = require("../controllers/blogControl");

const { verifyBlogOwner } = require("../middleware/middlewares");
const { PostBlogValidation, UpdateBlogValidation } = require("../middleware/validators/blog.validator.js");

blogRouter.get("/", getBlogs);

blogRouter.get(
  "/me",
  passport.authenticate("jwt", {session: false,}),
  getUserBlogs
);

blogRouter.get("/:id", getbyIDBlog);

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
