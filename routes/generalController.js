
const express = require("express");
const router = express.Router();

const session = require("express-session")
const mealkitModel = require("../models/mealkitModel")


router.get("/", (req, res) => {
    //the cake will be fetched from mongodb rather than fake db
    mealkitModel.find().exec().then(
        (cakeList)=>{
        let cake = []
        let tempCake = cakeList.map(value => value.toObject())
        tempCake.forEach(element => {
            if(element.topMeal)
            {
                cake.push(element)
            }
        })
        res.render("general/home", {
            cake: cake
        })
    })
});


router.get("/on-the-menu", (req, res) => {
    mealkitModel.find().exec().then(
        (cakeList)=>{
        let cake = []
        let tempCake = cakeList.map(value => value.toObject())
        
        for(let i = 0; i < tempCake.length; i++)
        {
            const currentThing = tempCake[i];
            const findCategoryName = currentThing.category;
            let categoryName = cake.find(c => c.categoryName == findCategoryName);
            if (!categoryName) {
                categoryName = {
                    categoryName: findCategoryName,
                    mealKits: []
                };
        
                cake.push(categoryName);
            }

            categoryName.mealKits.push(currentThing);
        }
        
        res.render("general/on-the-menu", {
            cake: cake
        })
    })
})

router.get("/on-the-menu/:id", (req, res) => {
    let message
    const mealkitId = req.params.id
    mealkitModel.find({_id:mealkitId}).exec().then(
        (cake)=>{
            
            let tempCake = cake.map(value => value.toObject())
            res.render("general/description", {
                cake: tempCake
            })
    }).catch(err =>{
        console.log(err)
    })
})


router.get("/add-mealkit/:id", (req, res) => {
    let message
    const mealkitId = req.params.id
    if(req.session.user){
        mealkitModel.find({_id:mealkitId}).exec().then(
            (cake)=>{
                
        let mealkit  = cake.map(value => value.toObject())
        let cart = req.session.cart = req.session.cart || []
        if(mealkit){
            //mealkit was found in the database
            //search the shopping cart to see if the song is already added
            let found = false
            cart.forEach(cartMealkit => {
                if(cartMealkit.id == mealkitId)
                {
                    found = true
                    cartMealkit.qty++
                }
            })
            if(found){
                message = "The mealkit was already in the cart, incremented the quantity by one in cart"
                res.redirect('/customer/cart')
            }
            else{
                //mealkit was not found int he shopping cart
                //create a new object and add to the cart
                cart.push({
                    id: mealkitId,
                    qty: 1,
                    mealkit
                })
                
                //cart.sort((a, b) => a.mealkit.name.localeCompare(b.mealkit.name))
                message = "The mealkit was added to the shopping cart."
                res.render("general/description", {
                    cake: mealkit,
                    message: message
                })
            }
        }
        else{
            message = "The mealkit was not found in the database."
            res.render("general/description", {
                cake: mealkit,
                message: message
            })
        }
                
        }).catch(err =>{
            console.log(err)
        })
        
        
    }
    else{
        message = "You must be logged in."
        mealkitModel.find({_id:mealkitId}).exec().then(
            (cake)=>{
                
                let tempCake = cake.map(value => value.toObject())
                res.render("general/description", {
                    cake: tempCake,
                    message: message
                })
        }).catch(err =>{
            console.log(err)
        })
    }

    
})

router.get("/remove-mealkit/:id", (req, res) => {
    let message
    const mealkitId = req.params.id
    if(req.session.user){
        let cart = req.session.cart || []
        const index = cart.findIndex(cartMealkit => cartMealkit.id == mealkitId)
        cart[index].qty--
        if(cart[index].qty === 0)
        {
            cart.splice(index, 1)
        }
    }
    
    res.redirect('/customer/cart')
})
router.get("/clear-mealkit", (req, res) => {
    let message
    const mealkitId = req.params.id
    if(req.session.user){
        req.session.cart = []
    }
    
    res.redirect('/customer/cart')
})

router.get("/place-order", (req, res) => {
    let email = req.session.user.email
    let cart = req.session.cart
   
    if(req.session.cart)
    {
        let order = []
        let cartTotal = 0
        cart.forEach(cartMealkit => {
            let [meal] = cartMealkit.mealkit
            cartTotal += meal.price * cartMealkit.qty
            meal.extendedPrice = (meal.price * cartMealkit.qty).toFixed(2)
        })
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email,
            from: "2869621248@qq.com",
            subject: "Your order confirmation",
            html:
                `
                Total Price: ${cartTotal}<br>
                order list: ${cart.map(element => {
                    return element.mealkit.map(meal =>
                         {
                             return (meal.title + " " + element.qty + " ")
                         })
                     
                 })}
                `
        };

        sgMail.send(msg)
            .then(() => {
                console.log("send successfully")
                req.session.cart = []
                res.redirect('/customer/cart')
            })
        
    }
    else{
        res.send("cart cannot be empty")
    }
    
       
    
    
})

router.get("/welcome", (req, res) => {
    res.render("general/welcome")
});


module.exports = router