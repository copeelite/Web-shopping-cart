const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const router = express.Router()


//log-in
router.get("/log-in", (req, res) => {
    res.render("user/log-in", {
        title: "log-in",
    });
}); 
let role = {type: ""}

router.post("/log-in", (req, res) => {
    let {email, password, typeOfLogin} = req.body;
    let passedValidation = true;
    let validationMessages = {};
    
    console.log(typeOfLogin)
    
    function checkIfLoginEmpty(){
        if (typeof email !== "string" || email.trim().length == 0) {
            passedValidation = false;
            validationMessages.email = "You must specify a email address";
        }
        else{
            console.log("not null")
        }
        if (typeof password !== "string" || password.trim().length == 0) {
            passedValidation = false;
            validationMessages.password = "You must specify a password";
        }
        else{
            console.log("not null")
        }
    }

    checkIfLoginEmpty()
    if(passedValidation)
    {
    // TODO: Validate the form information
    let errors = [];
    // Search MongoDB for the matching document (based on email address).
    userModel.findOne({
        email: email
    })
        .then(user => {
            // Completed the search.
            
            if (user) {
                
                // Found the user document.
                // Compare the password submitted to the password in the document.
                bcrypt.compare(password, user.password)
                    .then(isMatched => {
                        // Done comparing passwords.

                        if (isMatched) {
                            // Passwords match.
                            // Create a new session and store the user object.
                            req.session.user = user;
                            console.log("successful log in")
                            //identify type
                            //Customer 
                            //Data Entry Clerk
                            ///customer/cart /clerk/list-mealkits
                            if(typeOfLogin === "Data Entry Clerk")
                            {
                                user.profilePic = "/clerk/list-mealkits"
                                role.type = user.profilePic
                                //link = "/clerk/list-mealkits"
                                res.redirect("../clerk/list-mealkits");
                            }
                            else{
                                user.profilePic = "/customer/cart"
                               role.type = user.profilePic
                                //link = "/customer/cart"
                                res.redirect("../customer/cart");
                            }
                            console.log(req.session.user)
                            
                        }
                        else {
                            // Passwords are different.
                            errors.push("Sorry, you entered an invalid passwords.");
                            res.render("user/log-in", {
                                errors
                            });
                        }
                    })
            }
            else {
                // User was not found.
                errors.push("Email was not found in the database.");
                res.render("user/log-in", {
                    errors
                });
            }
        })
        .catch(err => {
            // Couldn't query the database.
            errors.push("Error finding the user in the database ... " + err);

            res.render("user/log-in", {
                errors
            });
        });
    }
    else{
        res.render("user/log-in", {
                title: "log-in",
                values: req.body,
                validationMessages
            })
    }
    
    
})
//logout
router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();

    res.redirect("/user/log-in");
});

//sign-up
router.get("/sign-up", (req, res) => {
    res.render("user/sign-up");
});

router.post("/sign-up", (req, res) => {
    console.log(req.body);

    let {firstName, lastName, email, password} = req.body;
    let passedValidation = true;
    let validationMessages = {};

    function checkEverything(){
        if (typeof firstName !== "string" || firstName.trim().length == 0) {
            passedValidation = false;
            validationMessages.firstName = "You must specify a firstName";
        }
        else{
            console.log("not null")
        }
        if (typeof lastName !== "string" || lastName.trim().length == 0) {
            passedValidation = false;
            validationMessages.lastName = "You must specify a lastName";
        }
        else{
            console.log("not null")
        }
        if (typeof email !== "string" || email.trim().length == 0) {
            passedValidation = false;
            validationMessages.email = "You must specify a email";
        }
        else if(!email.toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ))
        {
            passedValidation = false;
            validationMessages.email = "The email address format is invalid";
        }
        else{
            console.log("correct")
        }
    
        if (typeof password !== "string" || password.trim().length == 0) {
            passedValidation = false;
            validationMessages.password = "You must specify a password";
        }
        else if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).{8,12}$/))
        {
            passedValidation = false;
            validationMessages.password = "password that is between 8 to 12 characters and contains at least one lowercase letter, uppercase letter, number and a symbol which can be #?!@$%^&*-"
        }
        else{
            console.log("correct")
        }
    
    }
    function refresh(){
        res.render("user/sign-up", {
            title: "sign-up",
            values: req.body,
            validationMessages
        });
    }
    userModel.findOne({
        email
    }).then(user => {
        // Completed the search.
        if(user){
            // let errors = []
            // errors.push ('Email already exist')
            checkEverything()
            passedValidation = false
            validationMessages.email = "Email already exist";
            refresh()
        }
        else{
            checkEverything()
            if (passedValidation) {
                const sgMail = require("@sendgrid/mail");
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
                const msg = {
                    to: email,
                    from: "2869621248@qq.com",
                    subject: "sign-up Form Submission",
                    html:
                        `
                        Welcome ${firstName} ${lastName}<br>
                        Visitor's Full Name: ${firstName} ${lastName}<br>
                        author's name: FanghaoMeng<br>
                        website name: Carvel<br>
                        `
                };
        
                sgMail.send(msg)
                    .then(() => {
                        const user = new userModel({
                            firstName,
                            lastName,
                            email,
                            password
                        })
                        user.save()
                        .then(userSaved => {
                            console.log(`User ${userSaved.firstName} has been added to the database.`)
                            res.redirect("/welcome")
                        })
                        .catch(err => {
                            console.log(`Error adding user to the database ... ${err}`)
                        })
        
                    })
                    .catch(err => {
                        console.log(err);
                        refresh()
                    });
            }
            else {
                refresh()
            }
        }
    })
    

    

});




module.exports = router