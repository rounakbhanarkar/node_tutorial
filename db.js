const mongoose = require('mongoose');

//Define the mongoDB connection URL
const mongoURL = "mongodb://127.0.0.1:27017/hotels"

//set up mongoDB connection
mongoose.connect(mongoURL)

//Get the default connection
//Mongoose maintain the default connection object representing the MongoDB connection.
const db = mongoose.connection;

//define event listeners for database connection
db.on('connected',()=>{
    console.log("Connected to MongoDB server")
});

db.on('error',(err)=>{
    console.log("MongoDB connection error",err)
});

db.on('disconnected',()=>{
    console.log("MongoDB disconnected")
});

module.exports=db;