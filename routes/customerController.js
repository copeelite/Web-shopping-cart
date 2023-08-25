const express = require("express");
const router = express.Router();
const session = require("express-session")
const { authUser, authRole} = require("./basicAuth")
router.get("/cart", authUser, authRole("/customer/cart"), (req, res) => {
    res.render("customer/cart", prepareViewModel(req))
});
const prepareViewModel = function (req){

    if(req.session && req.session.user){
        let cart = req.session.cart || []
        let cartTotal = 0
        let extendedPrice = []
        const hasMealkits = cart.length > 0
        if(hasMealkits){
            cart.forEach(cartMealkit => {
                let [meal] = cartMealkit.mealkit
                cartTotal += meal.price * cartMealkit.qty
                meal.extendedPrice = (meal.price * cartMealkit.qty).toFixed(2)
            })
        }

        return{
            hasMealkits,
            mealkits: cart,
            cartTotal: "$" + cartTotal.toFixed(2)
        }
    }
    else {
        return {
            hasMealkits: false,
            mealkits: [],
            cartTotal: "$0.00"
        }
    }
}





module.exports = router