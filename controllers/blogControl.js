const BlogModel = require('../db/models/Blog')
const UserModel = require('../db/models/Users'),
      {read_time }= require('../middleware/middlewares')



//Read
exports.getBlogs = async (req,res,next) => {
  const { 
      state, 
      author , 
      title,
      tags,
      sort_by = 'createdAt', 
      sort,
      page = 0, 
      blogsPerPage = 20
  } = req.query;

  const findQuery = {};
  if(state){
    findQuery.state = {$regex:state, $options:"i"}
  }
  if(author){
    findQuery.author = {$regex:author, $options:"i"}
  }
  if(title){
    findQuery.title = {$regex:title, $options:"i"}
  }

  if(tags){
    const tagQuery = [];

  const tagAttributes = tags.split(',')
    //check if you are querying with just a tag or multiple tags
  if(tagAttributes.length == 1){
    findQuery.tags =  {$regex:tags, $options:"i"}

  }else{
    for (const attribute of tagAttributes) {
      tagQuery.push(attribute)
    }
      findQuery.tags = {$all: tagQuery}
    }
  }
  

  const sortQuery = {};

  const sortAttributes = sort_by.split(',')

  for (const attribute of sortAttributes) {
      if (sort === 'asc' && sort_by) {
          sortQuery[attribute] = 1
      }
  
      if (sort === 'desc' && sort_by) {
          sortQuery[attribute] = -1
      }
  }

    const blog = await BlogModel
    .find(findQuery)
    .sort(sortQuery)
    .skip(page * blogsPerPage)
    .limit(blogsPerPage);
    
    return res.status(200).json({message:"Got blogs", blog})

}
//Read with ID
exports.getBlog = async (req,res,next) => {
  // const id = req.params.id
  
  try{
    const id = req.params.id
    const blog = await BlogModel.findById(id).populate('author_id')

    if(!blog){
      return res.status(404).json({message:'no blog with specified id found'})
    }
    //increase the read count
    blog.read_count += 1
    blog.save()
  res.status(200).json({message:"Got blog", blog})
  }catch(err){
    next(err)
  }
  
}

//Read Logged In User Blogs
exports.getMyBlog  = async (req,res,next) =>{
  const { 
    state,
    page = 0, 
    blogsPerPage = 20
} = req.query;


const findQuery = {};
findQuery.author_id = req.user.id;
if(state){
  findQuery.state = {$regex:state, $options:"i"}
}
  
  try{
    const blog = await BlogModel
    .find(findQuery)
    .skip(page * blogsPerPage)
    .limit(blogsPerPage);
    if(!blog){
      return res.status(404).json({message:'You have not posted any blog'})
    }
    return res.status(200).json({message:"Got blogs", blog})

  }catch(error){
    next(error)
  }
  
}

//Create
exports.postBlog = async (req,res,next) => {
  const {title, description, tags, body} = req.body
  const author_id = req.user.id
  //gets author details
  const user = await UserModel.findById(author_id)
    if(!user) {
      return res.status(401).json({message:"User is not authorized"})
    }
    
    const {first_name, last_name} = user
    const author = `${first_name} ${last_name}`
    const reading_time = read_time(body)

    try{
      const blog = await BlogModel.create({title,description,tags,body, author_id, author, reading_time})
      res.status(201).json({message:"Created blog", blog})
    }
    catch(err){
      if (err.code === 11000) {
        next({
        status:400,
          message:"Blog Title already taken"
        });
      }
      else{
        next(err)
      }
    }
}

//Update
exports.updateBlog = async (req,res,next) => {
  const blogId = req.params.id
  const {title, description, tags, body, state} = req.body

  try{
    const blog = await BlogModel.findByIdAndUpdate(blogId, {title, description, tags, body, state}, { new: true})
    if(body){
      const reading_time = read_time(body)
      blog.reading_time = reading_time
      blog.save()
    }
    res.status(201).json({message:"Blog updated", blog})
  }catch(err){
    next(err)
  }
  
}
//Delete Blog
exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id
  try{
    const deletedBlog = await BlogModel.deleteOne({ _id: blogId})
    res.status(201).json({message:"Blog deleted", deletedBlog})
  }catch(err){
    next(err)
  }
}
//Bookmark Blog
exports.addBookmark = async (req, res) => {
  const blogId = req.params.id
  try {
    const blog = await BlogModel.findById(blogId)
    if (!blog) return res.status(404).json({status:"failed", message:"no blog with that id"})
    // check if the user already bookmarked the blog
    if (blog.bookmarks.filter(bookmark => bookmark.user.toString() === req.user._id.toString()).length > 0) {
      return res.status(400).json({ msg: 'Post already bookmarked' })
    }

    // add the user id to the bookmarks array
    blog.bookmarks.unshift({ user: req.user._id })
    await blog.save()
    res.json(blog.bookmarks)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
}
exports.getBookmarks = async (req, res) => {
  const blogId = req.params.id
  try{
    
  }catch(err){
    next(err)
  }
}