const express = require('express')
const router = express.Router()
const Person = require("../models/Person")
const mongoose = require('mongoose')
require('dotenv').config();

const {jwtAuthMiddleware,generateToken} = require('../jwt')

//GET method to get a person
router.get('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        const data = await Person.find()
        console.log("Data Fetched")
        res.status(200).json(data)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
})

//POST route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body //assuming request body contains the person data

        //create a new person document using mongoose model
        const newPerson = new Person(data);

        const response = await newPerson.save();
        console.log("Data saved.")

        const payload = {
            id:response.id,
            username:response.username
        }
        const token = generateToken(payload)

        res.status(200).json({response:response,token:token})
    }
    catch (error) {
        console.log(error)
        res.status(500).json({err:"internal server error"})
    }
})

//login route
router.post('/login',async(req,res)=>{
    try{
        //extract username and password from the request body
        const {username, password} = req.body

        //find user by username
        const user = await Person.findOne({username:username})

        //if user does not exist or password does not match return error
        if(!user || !(await user.comparePassword(password))) 
        { 
            return res.status(401).json({error:"Invalid username or password"})
        }

        //generate token
        const payload = {
            id: user.id,
            username:user.username
        }

        const token = generateToken(payload);

        //return token as response
        res.json({token})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal server error"})
    }
})

//profile route, get person based on their profile by jwttoken authorization
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
         const userData = req.user;
        console.log("User data: ",userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"Internal server error"})
    }
})

//get person based on work=['chef','manager','waiter']
router.get('/:worktype',async(req,res)=>{
    try{
        const worktype = req.params.worktype
        
        if(worktype == "chef" || worktype == "manager" || worktype == "waiter"){

            const response = await Person.find({work:worktype})
            res.status(200).json(response)
        }
        else{
            res.status(404).json({error:"Invalid worktype"})
        }
    }
    catch(err){
        res.status(500).json({err:"Internal server error"})
    }
})

//update person based on unique id
router.put('/:id', async(req,res)=>{
    try{
        const validpersonId = mongoose.Types.ObjectId.isValid(req.params.id)

        if(validpersonId){
            const personId = req.params.id
            const updatedPerson = req.body
    
            const response = await Person.findByIdAndUpdate(personId,updatedPerson,{
                new:true, //return the updated document
                runValidators:true //run mongoose validation
            })
            console.log("person data updated")
            res.status(200).json(response)
        }
        else{
            return res.status(404).json({error:"Person not found"})
        }
    }
    catch(err){
        console.log(err.message)
        res.status(500).json({err:"Internal server error"})
    }
})

router.delete("/:id", async(req,res)=>{
    try{

        const validpersonId = mongoose.Types.ObjectId.isValid(req.params.id)
        if(validpersonId){

            const personId = req.params.id
            const response = await Person.findByIdAndDelete(personId)

            console.log("person data deleted")
            res.status(200).json({message:"person deleted successfully."})
        }
        else{
            return res.status(404).json({error:"Person not found"})
        }

    }
    catch(err){
        res.status(500).json({err:"Internal server error"})
    }
})

module.exports = router;