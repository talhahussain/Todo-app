const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({

     name: {

          type: String,
          required: [true, "Please Provide your name"],
          lowercase: true
     },
     email: {

          type: String,
          unique: true,
          required: [true, "Please Provide you email address"],
          validate: [validator.isEmail, 'Please Provide Valid Email Address']
     },
     password: {

          type: String,
          select: false,
          required: [true, "please Enter your Password"],
          
     },
     confirmPassword: {

          type: String,
          required: true,
          validate: {
               validator: function(e1) {
                    return this.password === e1;
               }
          }
     },

})

userSchema.pre("save", async function(next) {
     
     if(!this.isModified("password")) return next();

     this.password = await bcrypt.hash(this.password, 12)
     this.confirmPassword = undefined;
     next();
     
})

const User = mongoose.model('User', userSchema);
module.exports = User;