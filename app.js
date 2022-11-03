const express = require('express')  


const userRouter = require('./routes/users')
const blogRouter = require('./routes/blogs')
const passport = require('passport')
const app = express()


//dotenv
require('dotenv').config()

//middlewares
app.use(express.json());

//initialise passport
require('./config/passport')
app.use(passport.initialize());



//routes
app.get('/', (req,res) => {
  res.status(200).json({message:"welcome to blog"})
})
app.use('/user',userRouter )
app.use('/blog',blogRouter )

// Handle error for unknown route
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'route not found' })
})


// const serverApp = app.listen(3000, ()=>{
//   console.log(`app started`)
// })

// database connection
// connectDB(app)


module.exports = app