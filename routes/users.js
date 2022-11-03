const express = require('express')

const userRouter = express.Router()
const {signup, signin} =require('../controllers/userControl')

userRouter.post('/signup',signup )
userRouter.post('/login',signin )


module.exports = userRouter