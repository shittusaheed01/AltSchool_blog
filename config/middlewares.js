const jwt = require("jsonwebtoken");
const BlogModel = require('../models/Blog')


// const sendToken = (req, res, next) => {
// let token = "";
// if (req.headers.authorization && req.headers. authorization.split(" ")[0] === "Bearer") {
//   token = req.headers.authorization.split(" ")[1];
//   } else {
//     token = "";
//   }
// jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//   if (user) {
//       req.user = user;
//   }else{
//       req.user = "";
//   }
      
// });
// next();
// };

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
// const checkBody = (body) => {
//   const allowedUpdates = ['title','description', 'tags','body','state']
//   const keys = Object.keys(body);
//   const isUpdationValid = keys.every(key => allowedUpdates.includes(key))
//   return isUpdationValid
// }


module.exports = {

verifyBlogOwner,
read_time,
// checkBody,
};