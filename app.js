const express = require('express')  


const userRouter = require('./routes/users')
const blogRouter = require('./routes/blogs')
const passport = require('passport')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const app = express()


//dotenv
require('dotenv').config()

//Rate Limiting
const limiter = rateLimit({
	windowMs: 0.5 * 60 * 1000,
	max: 4,
	standardHeaders: true,
	legacyHeaders: false,
})

//security
app.use(helmet())
//MiddleWares
app.use(express.json());

//initialize passport
require('./config/passport')
app.use(passport.initialize());



//routes
app.get('/', (req,res) => {
  res.status(200).json({message:"welcome to blog"})
})

//limit calls to blog and user
app.use(limiter)

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