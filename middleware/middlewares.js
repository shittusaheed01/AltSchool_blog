const jwt = require("jsonwebtoken");
const BlogModel = require('../db/models/Blog')

const verifyBlogOwner = async (req, res, next) => {
const blogId = req.params.id
const blog = await BlogModel.findById(blogId).populate("author_id")
if(!blog){
  return res.status(404).json({message:"blog not found"})
}
// const user_id = req.user.id
if(req.user.id !== blog.author_id.id){
  return res.status(401).json({message:"You are unauthorized to make changes to this blog"})
}else{
  next()
}
};
const read_time = (blog)=>{
  const totalwords = blog.split(" ").length,
        averageWPM = 175,
        totalMin = Math.round(totalwords / averageWPM),
        reading_time= totalMin + " minutes"
  return reading_time
}

const errorMiddleware = (error, req,res, next) => {

}

module.exports = {

verifyBlogOwner,
read_time,
errorMiddleware
// checkBody,
};