const UserModel = require('../db/models/Users')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// create json web token
const createToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '1h'
  });
};




exports.signup = async (req,res,next) =>{
  try{
    const user = await UserModel.create(req.body)
    const returnUser = user.toJSON()
    const token = createToken(user._id)
    res.status(201).json({message: 'Signup successful',user:returnUser, token})

  }
  catch(err){
    if (err.code === 11000) {
      next({
      status:400,
        message:"Email already exists"
      });
    }
    else{
      next(err)
    }
  }
  
}

exports.signin = async (req,res,next) =>{
  const {email, password} = req.body
  try{
    const user = await UserModel.findOne({email:{$regex:email, $options:"i"}})
    if(!user) {
      return res.status(404).json({message:"email isn't registered"})
    }
    const validPassword = await user.isValidPassword(password)
    if(!validPassword) {
      return res.status(404).json({message:"invalid password"})
    }
    const token = createToken(user._id)
    const returnUser = user.toJSON()
    res.status(200).json({message: 'Login successful', user:returnUser, token})

  }
  catch(err){
    next(err)
  }
}
