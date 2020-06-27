const asyncHandler = require('../utils/catchAsync')
const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const { Error } = require('mongoose')

// @desc       create JWT token with user id
const signToken = id => {

     return jwt.sign({id}, process.env.JWT_SECRET_TOKEN, {
          expiresIn: process.env.JWT_EXPIRES_IN
     })
}
// @desc       create JWT token for user and send response
createSendJwtToken = (user, statusCode, res) => {

     const token = signToken(user._id);

     user.password = undefined;

     res.status(statusCode).json(({
          status: "success",
          token,
          user
     }))

}

// @desc      signup user
// @route     POST /user/signup
// @access    Public
exports.signup = asyncHandler(async (req, res) => {


     try{

          // 1) Create new User
          const user = await User.create({

               name                : req.body.name,
               email               : req.body.email,
               password            : req.body.password,
               confirmPassword     : req.body.confirmPassword
          })
     
          // 2) Save for the password hash
          await user.save({validateBeforeSave: false})

          // (Can send email confirmation here, not doing now)

          // 3) Send success status if successful
          res.status(201).json({
               status: "Success",
               message: "Successfully Created User"
          })

     }
     catch(err){

          // 4) Send fail status if user creation failed
          res.status(500).json({
               status: "Fail",
               message: "Cannot Create User",
               data: err.message
          })

     }

})


// @desc      login user
// @route     POST /user/login
// @access    Public
exports.login = asyncHandler(async (req, res) => {

     const {email, password} = req.body;

     // 1) Check if email or password is provided by user
     if(!email || !password){

          // 2) If not then send failed message
          return res.status(400).json({
               status: "fail",
               message: "Please provide email or password"
          })
     }

     // 2) Find user and also select password
     const user = await User.findOne({email}).select("+password");

     // 3) Check If no user found or password is incorrect
     if(!user || !(await user.comparePassword(password, user.password))){
          
          // 4) If incorrect password and no user found then send error 
          return res.status(400).json({
               status: "fail",
               message: "Incorrect email or password"
          })

     }

     // 5) If all credentials verified then create JWT token
     createSendJwtToken(user, 200, res)

})

// @desc      Implementation for Protected route for authorized users
exports.protect = asyncHandler(async (req, res, next) => {


     try{

          let token;

          // 1) Checking if Bearer token is available and starts with Bearer
          if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

               // 2) Split the Bearer token and take only token
               token = req.headers.authorization.split(' ')[1]
          }

          // 3) Check if token is available
          if(!token) throw new Error("Please login to get access")

          // 4) Get user id by verifying the user
          const decode = await jwt.verify(token, process.env.JWT_SECRET_TOKEN)

          // 5) Get the user by decoded id
          const currentUser = await User.findById(decode.id);

          // 6) Check if the user is available with the current id
          if(!currentUser) throw new Error("User does not exist")

          // 7) User is authenticated
          req.user = currentUser;
          next();
          

     }
     catch(err) {

          res.status(401).json({
               status: "Fail",
               message : err.message
          })
     }
     
})