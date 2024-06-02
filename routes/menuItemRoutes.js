const express = require('express')
const router = express.Router()

const MenuItem = require("../models/MenuItem")

//GET method to get menu items
router.get('/',async(req,res)=>{
    try{
        const data = await MenuItem.find()
        console.log("Menu Fetched")
        res.status(200).json(data)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
})

//POST route to add a menu item
router.post('/', async (req, res) => {
    try {
        const data = req.body //assuming request body contains the menu item data

        //create a new menu item document using mongoose model
        const newMenu = new MenuItem(data);

        const response = await newMenu.save();
        console.log("Menu added.")
        res.status(200).json(response)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({err:"internal server error"})
    }
})

router.get('/:taste',async(req,res)=>{
    try{
        const tastetype = req.params.taste

        if(tastetype == "sweet" || tastetype == "sour" || tastetype == "spicy"){

            const data = await MenuItem.find({taste:tastetype})
            console.log("Menu Fetched")
            res.status(200).json(data)
        }
        else{
            res.status(404).json({error:"Taste type not found"})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
})

//comment added for testing purpose to push changes on github
module.exports = router;