const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./utils/database')
const app = express()

// @desc       importing different routes
const userRoute = require('./routes/userRoute')

// @desc       Adding env variable path to express
dotenv.config({path: './config/config.env'})

// @desc       connect to database
connectDb();

// @desc       using body parser
app.use(express.json());

// @desc       routes
app.use('/user', userRoute);

// @desc       read port number from config file and start server
const port = process.env.PORT || 5000
const server = app.listen(port, () => {

     console.log("Server is started at port",port)
})

module.exports = server;