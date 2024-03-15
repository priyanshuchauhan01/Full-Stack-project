const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    comments : String ,
    rating : {
        type : Number,
        min : 0,
        max : 5
    },
    date : {
        type : Date,
        default : Date.now()
    },
});

module.exports = mongoose.model("Review" , reviewSchema)

