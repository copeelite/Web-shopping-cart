const express = require("express");
const router = express.Router();
const { authUser, checkDirection} = require("./basicAuth")
const session = require("express-session");
const mealkitModel = require("../models/mealkitModel");
// router.get("/meal-kits", authUser, checkDirection, (req, res) => {
//     res.render("clerk/load-data-mealkits")
// }); 
var cake = [
    {
        title: "Fudgie the Whale",
        includes: "Vanilla and Chocolate ice-cream, Crunch in the Middle",
        description: "The king of all ice cream Whales",
        category: "Father's Day",
        price: 29.99,
        cookingTime: 60,
        servings: 10,
        imageUrl: "cake5.png",
        topMeal: true
    },
    {
        title: "Cookie Puss",
        includes: "Vanilla and Chocolate ice-cream, Crunch in the Middle",
        description: "The craziest cake in the universe",
        category: "Ice cream Day",
        price: 29.99,
        cookingTime: 60,
        servings: 10,
        imageUrl: "cake6.png",
        topMeal: true
    },
    {
        title: "Fudge Marshmallow Crunch",
        includes: "Vanilla and Chocolate ice-cream, Crunch in the Middle, top with marshmallow",
        description: "Looks almost too good to eat",
        category: "Ice cream Day",
        price: 39.99,
        cookingTime: 120,
        servings: 12,
        imageUrl: "cake7.png",
        topMeal: true
    },
    {
        title: "Perfect Picture Cake",
        includes: "Vanilla and Chocolate ice-cream, Crunch in the Middle, top with edible image",
        description: "Frame your photo in frosting",
        category: "Ice cream Day",
        price: 39.99,
        cookingTime: 240,
        servings: 12,
        imageUrl: "cake8.png",
        topMeal: false
    },
    {
        title: "Crazy Silly Emoji",
        includes: "Make your cake special, you can customize it with your favorite flavors and an alternate center topping",
        description: "A sense of humor and taste",
        category: "Ice cream Day",
        price: 29.99,
        cookingTime: 120,
        servings: 10,
        imageUrl: "cake9.png",
        topMeal: false
    },
    {
        title: "Tie Cake",
        includes: "Maybe he does need another tie for Father's Day. Especially one made of ice cream.",
        description: "All business",
        category: "Father's Day",
        price: 49.99,
        cookingTime: 120,
        servings: 20,
        imageUrl: "cake10.png",
        topMeal: false
    }
]

router.get("/meal-kits", (req, res) => {
    if(req.session && req.session.user && req.session.user.profilePic === "/clerk/list-mealkits")
    {
        mealkitModel.find().count({},(err, count)=>{
            if(err){
                res.send("Couldn't count the documents: " + err)
            }
            else if(count === 0)
            {
                //"no document exists, add the new one."
                mealkitModel.insertMany(cake, (err, docs) =>{
                    if(err){
                        res.send("Couldn't insert the mealkit, error: " + err)
                    }
                    else{
                        res.send("Added meal kits to the database.")
                    }
                })
            }
            else{
                res.send("There are already documents loaded.")
            }
        })
        //clerk sign in, load the data here
        
        //res.render("clerk/load-data-mealkits")
    }
    else{
        return res.send("You are not authorized to add meal kits")
    }
})

// router.post("/meal-kits", (req, res) => {
//     console.log(req.body)

// })


module.exports = router