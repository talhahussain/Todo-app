const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')
const todoController = require('../controller/todoController')

router.get("/", authController.protect, todoController.getTask)
router.post('/new', authController.protect, todoController.addTask)
router.put("/update/:id", authController.protect, todoController.updateTask)
router.delete("/delete/:id", authController.protect, todoController.deleteTask)


module.exports = router;