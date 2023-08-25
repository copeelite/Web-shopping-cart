const mealkitModel = require("../models/mealkitModel");
const express = require("express");
const router = express.Router();
const { authUser, authRole} = require("./basicAuth")
const path = require("path")
const fs = require('fs') // I don't need to delete the photo file from my web server

router.get("/list-mealkits", authUser, authRole("/clerk/list-mealkits"), (req, res) => {

    mealkitModel.find().exec().then(
        (cakeList)=>{
        let cake = []
        let tempCake = cakeList.map(value => value.toObject())
        tempCake.forEach(element => {
                cake.push(element)
        })
        res.render("clerk/list-mealkits", {
            cake: cake
        })
    })
});

router.post("/add-mealkit", authUser, authRole("/clerk/list-mealkits"), (req, res) => {
    let {title, includes, category, price, cookingTime, servings, topMeal, description} = req.body;
    //let itemPicName = ""
    let checkAllInput = true
    let validationMessages = {};
    // if(!topMeal){
    //     topMeal = false
    // }
    function checkFileExt(){
        let extension = path.parse(req.files.imageUrl.name).ext.substring(1)
        return (extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "png") ? true : false
    }
    function checkIfAddInputEmpty(){
        if (typeof title !== "string" || title.trim().length == 0) {
            checkAllInput = false;
            validationMessages.title = "You must specify a title";
        }
        if (typeof includes !== "string" || includes.trim().length == 0) {
            checkAllInput = false;
            validationMessages.includes = "You must specify a includes";
        }
        if (typeof category !== "string" || category.trim().length == 0) {
            checkAllInput = false;
            validationMessages.category = "You must specify a category";
        }
        if (typeof price !== "string" || price.trim().length == 0) {
            checkAllInput = false;
            validationMessages.price = "You must specify a price";
        }
        else if(!Number(price))
        {
            checkAllInput = false;
            validationMessages.price = "You must specify a price (number only)";
        }
        if (!Number(cookingTime)) {
            checkAllInput = false;
            validationMessages.cookingTime = "You must specify a cookingTime(number only)";
        }
        if (!Number(servings)) {
            checkAllInput = false;
            validationMessages.servings = "You must specify a servings(number only)";
        }
        if (!req.files) {
            checkAllInput = false;
            validationMessages.imageUrl = "You must specify a file";
        }
        //check if the file is 
        else if(!checkFileExt()){
            checkAllInput = false;
            validationMessages.imageUrl = "You can only upload images types are jpg, jpeg, gif, or png";
        }
        //no verify for topMeal
        if (typeof description !== "string" || description.trim().length == 0) {
            checkAllInput = false;
            validationMessages.description = "You must specify a description";
        }
    }
    
    checkIfAddInputEmpty()
    

    if(checkAllInput)
    {
        
        const cake = new mealkitModel({
            title,
            includes,
            description,
            category,
            price,
            cookingTime,
            servings,
            imageUrl: req.files.imageUrl.name,
            topMeal: topMeal ? true : false,

        })

        cake.save()
        .then(cakeSaved => {
            
            console.log(`Item ${cakeSaved.title} has been added to the database.`)

            let uniqueName = `cake-${cakeSaved._id}${path.parse(req.files.imageUrl.name).ext}`
            req.files.imageUrl.mv(`assets/image/${uniqueName}`)
            .then(() =>{
                mealkitModel.updateOne(
                    {
                    _id: cakeSaved._id
                    }, 
                {
                    imageUrl: uniqueName
                })
                .then(()=>{
                    console.log("Add the item pic.")
                    res.redirect("../clerk/list-mealkits")
                })
                .catch(err =>{
                    console.log(`Error add the item pic ... ${err}`)
                    res.redirect("../clerk/list-mealkits")
                })
            })
            .catch(err =>{
                console.log(`Error save the item pic ... ${err}`)
                res.redirect("../clerk/list-mealkits")
            })
        })
        .catch(err =>{
            console.log(`Error adding item to the database ... ${err}`)
            res.redirect("../clerk/list-mealkits")
        })
    


        //put into database at here
        // res.send(`${title},${includes},${category},${price},${cookingTime},${servings},"this will show file name  ****"${path.parse(req.files.itemPic.name).ext.substring(1)},${topMeal},${description}`)
    }
    else{
        //show the error
        res.render("clerk/list-mealkits", {
            values: req.body,
            validationMessages
        })
    }
    
});


router.post("/edit-mealkit/:id", authUser, authRole("/clerk/list-mealkits"), (req, res) => {
    //fetch all things from edit form
    let {title, includes, category, price, cookingTime, servings, topMeal, description} = req.body;
    //let itemPicName = ""
    let validationMessages = {};
    let checkIfOfferRightPic = true;
    let checkIfOfferPic = true;
    let uniqueName = ""
    let errors = []
    //if user keep input same, mongodb not update
    //if user keep it empty, mongodb will not accept
    function checkFileExt(){
        let extension = path.parse(req.files.imageUrl.name).ext.substring(1)
        return (extension === "jpg" || extension === "jpeg" || extension === "gif" || extension === "png") ? true : false
    }
    //compare data from edit form with data from Mongodb, update the item 
    const id = req.params.id
    mealkitModel.findById(id, (error, data) => {
        if(error){
            console.log(error)
        }
        else{
            if (!req.files) {
                checkIfOfferPic = false
                checkIfOfferRightPic = true;
            }
            //check if the file is 
            else if(!checkFileExt()){
                checkIfOfferPic = false
                checkIfOfferRightPic = false;
                validationMessages.imageUrl = "You can only upload images types are jpg, jpeg, gif, or png";
                errors.push("You can only upload images types are jpg, jpeg, gif, or png")
            }
            else{
                checkIfOfferPic = true
                uniqueName = `cake-${id}${path.parse(req.files.imageUrl.name).ext}`
            }
            if(title && includes&& category&& Number(price)&&Number(cookingTime)&& Number(servings)&& description && checkIfOfferRightPic)
            {
                if(checkIfOfferPic)
                {
                    req.files.imageUrl.mv(`assets/image/${uniqueName}`).then(()=>{
                        mealkitModel.updateOne({_id:id},{ $set: {title, includes, category, price, cookingTime, servings, description, imageUrl: uniqueName, topMeal: topMeal ? true : false}}).exec().then(()=>{
                            console.log("Updated the edit successfully")
                            res.redirect("/clerk/list-mealkits")
                        })
                    })
                }
                else{
                    mealkitModel.updateOne({_id:id},{$set: {title, includes, category, price, cookingTime, servings, description, topMeal: topMeal ? true : false}}).exec().then(()=>{
                        console.log("Updated the edit successfully without pic update")
                        res.redirect("/clerk/list-mealkits")
                    })
                }
            }
            else{
                res.render("clerk/list-mealkits", {
                    errors
                })
            }
            //if user keep input same, mongodb not update
            //if user keep it empty, mongodb will not accept
        }
    })

});


router.get("/remove-mealkit/:id", authUser, authRole("/clerk/list-mealkits"), (req, res) => {
    mealkitModel.findOneAndDelete({_id: req.params.id}).exec().then(() => {
        res.redirect("/clerk/list-mealkits")
    })
});
module.exports = router