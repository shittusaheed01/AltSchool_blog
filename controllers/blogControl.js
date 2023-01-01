const BlogModel = require('../models/Blog')
const UserModel = require('../models/Users'),
      {read_time }= require('../config/middlewares')



//Read
exports.getBlogs = async (req,res) => {
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
    
    return res.status(200).json({message:"blogs gotten", blog})

}
//Read with ID
exports.getbyIDBlog = async (req,res) => {
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
  res.status(200).json({message:"blogs gotten", blog})
  }catch(err){
    console.log(err)
    res.status(400).json({message:"blog not found"})
  }
  
}

//Read Logged In User Blogs
exports.getUserBlogs  = async (req,res) =>{
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
    return res.status(200).json({message:"blogs gotten", blog})

  }catch(error){
    return res.status(404).json({message:"an error occurred", error})
  }
  
}

//Create
exports.postBlog = async (req,res) => {
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
      // const blog = await new BlogModel({title,description,tags,body, author_id, author})
      res.status(201).json({blog})
    }
    catch(err){
      console.log(err)
      res.status(400).json({message:'could not create blog'})
    }
}

//Update
exports.updateBlog = async (req,res) => {
  const blogId = req.params.id
  const {title, description, tags, body, state} = req.body

  try{
    const blog = await BlogModel.findByIdAndUpdate(blogId, {title, description, tags, body, state}, { new: true})
    if(body){
      const reading_time = read_time(body)
      blog.reading_time = reading_time
      blog.save()
    }
    res.status(201).json({message:"blog updated", blog})
  }catch(err){
    console.log(err)
    res.status(400).json({message:"an error occurred"})
  }
  
}
//Delete Blog
exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id
  try{
    const deletedBlog = await BlogModel.deleteOne({ _id: blogId})
    res.status(201).json({message:"blog deleted", deletedBlog})
  }catch(err){
    console.log(err)
    res.status(400).json({message:"an error occurred"})
  }
}