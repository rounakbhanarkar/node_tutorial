const express = require('express')
const router = express.Router()
const Person = require("../models/Person")
const mongoose = require('mongoose')

//GET method to get a person
router.get('/',async(req,res)=>{
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
router.post('/', async (req, res) => {
    try {
        const data = req.body //assuming request body contains the person data

        //create a new person document using mongoose model
        const newPerson = new Person(data);

        const response = await newPerson.save();
        console.log("Data saved.")
        res.status(200).json(response)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({err:"internal server error"})
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