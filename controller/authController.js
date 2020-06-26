const asyncHandler = require('../utils/catchAsync')
const User = require('../model/userModel')


// @desc      signup user
// @route     POST /user/signup
// @access    Public
exports.signup = asyncHandler(async (req, res, next) => {


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