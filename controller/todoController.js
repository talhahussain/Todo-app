const asyncHandler = require('../utils/catchAsync')
const Todo = require('../model/todoModel');

// @desc       This function filtered the not allowed attributes for update
const filterObj = (obj, ...allowedFields) => {

     const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});
	return newObj;
};


// @desc      add task
// @route     POST /todo/new
// @access    private
exports.addTask = asyncHandler(async (req, res) => {


     try{

          // 1) Create new task
          const task = await Todo.create({

               description    : req.body.description,
               assigned       : req.user._id,
               completed      : req.body.completed
          })

          // 2) Send success message to user
          res.status(201).json({

               status : "Success",
               message : "Successfully Created",
               data: task
          })
     }
     catch(err) {

          // 3) If fail send failed message to user
          res.status(500).json({

               status: "Error",
               message: "Cannot create Task",
               data: err.message
          })
     }

})

// @desc      update task
// @route     PUT /todo/update/:id
// @access    private
exports.updateTask = asyncHandler(async (req, res) => {

     // 1) Find the task of current user
     const task = await Todo.findOne({_id: req.params.id, assigned: req.user._id})

     // 2) If task is not available then send failed response to user
     if(!task){
          
          return res.status(404).json({
               status: "Fail",
               message: "No such task found",
          })
     }

     // 3) Filtered to get only allowed fields to get updated
     const allowedFields = filterObj(req.body, "completed", "description")
     const keys = Object.keys(req.body)

     // 4) Update each attribute by keys
     keys.forEach(key => task[key] = allowedFields[key])

     try{

          // 5) Updated Task save to db
          await task.save();

          // 6) Success response send to user
          res.json({

               status: "Success",
               message: "Successfully updated task",
               data: task
          })
     }
     catch(err) {

          // 7) On failure fail response send to user
          res.status(500).json({

               status: "Error",
               message: "Cannot update the task",
               data: err.message
          })
     }
})


// @desc      delete task
// @route     DELETE /todo/delete/:id
// @access    private
exports.deleteTask = asyncHandler(async (req, res) => {

     
     try{
          
          // 1) Find the task of current user by id
          const task = await Todo.findOneAndDelete({_id: req.params.id, assigned: req.user._id})

          // 2) If no task available for given id then send failed response to user
          if(!task){
     
               return res.status(404).json({
                    status:"Fail",
                    message: "No such task available",
               })
          }

          // 2) On success task is deleted and success response send to user
          res.json({
               status:"Success",
               message: "Successfully deleted Task",
               data: task
          })

     }
     catch(err) {

          // 3) On failure Error response send to user
          res.status(500).json({
               status:"Error",
               message: "Cannot delete the Task",
               data: err.message
          })

     }

})



// @desc      get task
// @route     GET /todo/
// @access    private
exports.getTask = asyncHandler(async (req, res) => {

     const match = {}

     // 1) Check if user want to get only completed or not completed task
     if(req.query.completed)
          match.completed = req.query.completed === 'true';

     try{

          // 2) Get the user task and populate current user with task
          await req.user.populate({

               path: 'todo',
               match

          }).execPopulate()

          // 3) On success Tasks are send to user
          res.json({

               status: "Success",
               data: req.user.todo
          })

     }
     catch(err){

          // 4) On failed error message send to user
          res.status(500).json({

               status: "Error",
               message: "Cannot get the task",
               data: err.message
          })

     }
})