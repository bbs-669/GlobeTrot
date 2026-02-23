const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:{
        type:String,
        required:[true,"Comment required"]
    },
    rating:{
        type:Number,
        required:[true,"Rating required"],
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;