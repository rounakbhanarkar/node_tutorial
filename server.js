////----------------DAY 1--------------------
// var fs = require('fs')
// var os = require('os')

// var user = os.userInfo()

// console.log(user);
// console.log(user.username);

// fs.appendFile('greeting.txt',`Hi,hello..${user.username}\n`,()=>console.log("file created"));

// console.log("server file loaded..")
// var notes = require('./notes')
// console.log("-------------")

// const notes2 = notes.greet;

// notes2();



////-----------------DAY 2 ------------------------

// const express = require('express')
// const app = express();

// app.get('/',function(req,res){
//     res.send("Welcome to my hotel...How can I help you?, we have list of menus.")
// })

// app.get('/idli',(req,res)=>{
//     res.send("We have Idli here...")
// })

// app.get('/chicken',(req,res)=>{
//     var customized_chicken = {
//         name:'fried chicken',
//         size:'2kg',
//         price:250,
//         is_legpiece:true,
//         boneless:false
//     }

//     res.send(customized_chicken)
// })

// app.post('/items',(req,res)=>{
//     res.send("data is saved..")
// })

// app.listen(3000,()=>{
//     console.log('listening on port 3000')
// });

// -----------------DAY 3 ------------------------

const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');

//accessing PORT variable from .env file if available use PORT value or else use 3000 PORT
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json())


//Middleware function
const logRequest = (req,res,next) =>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
    next(); //move on to the next phase
}
app.use(logRequest);



app.use(passport.initialize())

const localAuthMiddleware = passport.authenticate('local',{session:false})

app.get('/', function (req, res) {
    res.send("Welcome to my hotel...How can I help you?, we have list of menus.")
})

const personRouter = require('./routes/personRoutes')
app.use('/person', personRouter)


const menuRouter = require('./routes/menuItemRoutes')
app.use('/menuitem',menuRouter)


app.listen(PORT, () => {
    console.log('listening on port 3000')
});