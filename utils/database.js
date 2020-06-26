const mongoose = require('mongoose')


const connectDb = async () => {

     const db = process.env.MONGODB_URI;

     await mongoose.connect(db, {

          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: true,
          useUnifiedTopology: true
     })

     console.log("DB connection Successful");
}

module.exports  = connectDb;