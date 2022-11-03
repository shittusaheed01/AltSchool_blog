const UserModel = require('../models/Users')
const jwt = require('jsonwebtoken');

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code) ;
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err._message === 'User validation failed') {
    errors.email = 'That email is not valid';
  }

  return errors;
}

// create json web token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};




exports.signup = async (req,res) =>{
  const {email, password, first_name, last_name} = req.body

  if(!email || !password || !first_name || !last_name) {
    return res.status(400).json({message:'Please enter a valid email, password, first_name and last_name'})
  }
  try{
    const user = await UserModel.create({email,password,first_name,last_name})
    const returnUser = user.toJSON()
    const token = createToken(user._id)
    // const {password, ...others} = user
    res.status(201).json({message: 'Signup successful',user:returnUser, token})

  }
  catch(err){
    const error = handleErrors(err)
    res.status(400).json({error})
  }
  
}

exports.signin = async (req,res) =>{
  const {email, password} = req.body

  if(!email || !password) {
    return res.status(400).json({message:'Please enter a valid email and password'})
  }
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
    console.log(err)
    const error = handleErrors(err)
    res.status(400).json({error})
  }
}
