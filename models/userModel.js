const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: String,
    dateCreated: {
        type: Date,
        default: Date.now()
    }
})
userSchema.pre("save", function(next){
    let user = this

    //generate the salt
    bcrypt.genSalt(10)
    .then(salt => {
        //hash the password using the generated salt
        bcrypt.hash(user.password, salt)
        .then(hashPwd =>{
            user.password = hashPwd
            next()
        })
        .catch(err => {
            console.log(`Error occurred when salting ... ${err}`)
        })
    })
    .catch(error =>{
        console.log(`Error occurred when salting ... ${error}`)
    })
})
const userModel = mongoose.model("users", userSchema)

module.exports = userModel 
