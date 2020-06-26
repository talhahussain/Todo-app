const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({

     description: {

          type: String,
          required: [true, "Please Provide task description"],
     },
     completed: {

          type: Boolean,
          default: false
     },
     assigned: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
     }

})


const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;