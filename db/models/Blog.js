const mongoose = require('mongoose'),
{ Schema } = mongoose;

const BlogSchema = new Schema({
  title: {
    type: String,
    unique: [true, "Title already exists"],
    required: [true, 'Enter a title'],
    trim:true
  },
  description: {
    type: String,
    trim:true
  },
  author: {
    type: String,
    trim:true
  },
  author_id:{
    type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      trim:true,
      required:true
  },
  bookmarks: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        trim:true
      }
    }
  ],
  state: {
    type:String,
    enum: ['published', 'draft'],
    default: 'draft',
    trim:true 
  },
  read_count: {
    type:Number,
    default: 0
  },
  reading_time: {
    type:String,
  },
  tags: [{
    type: String,
    trim:true
}],
  body: {
    type:String,
    required: [true, "body can't be empty"],
    trim:true
  },
}, {timestamps:true});


module.exports = mongoose.model("Blog", BlogSchema)