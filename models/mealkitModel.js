const mongoose = require("mongoose")

const mealkitSchema = new mongoose.Schema({
    title:{type: String, required: true},
    includes:{type: String, required: true},
    description:{type: String, required: true},
    category:{type: String, required: true},
    price:{type: String, required: true},
    cookingTime:{type: Number, required: true},
    servings: {type: Number, required: true},
    imageUrl: {type: String, required: true},
    topMeal: {type: Boolean, required: true},
    dateCreated: {
        type: Date,
        default: Date.now()
    }
})
const mealkitModel = mongoose.model("mealkits", mealkitSchema)
module.exports = mealkitModel 