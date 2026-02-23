const mongoose = require("mongoose");
const Review = require("./review.js");


// Define the nested Image Schema first
const ImageSchema = new mongoose.Schema({
    filename: {
        type: String,
        default:"default-filename"
    },
    url: {
        type: String,
        set: v => v?.trim() === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU8fZIwlWQ3qT8QPa9UuBK-BBux6HxNmbvbg&s" : v,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU8fZIwlWQ3qT8QPa9UuBK-BBux6HxNmbvbg&s"
    },
}, { _id: false }); 


const ListingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title Required"],
    },
    description:{
        type:String,
        maxlength:1000,
        required:[true,"Description Required"],
    },
   image: {
        type: ImageSchema, 
        required:[true,"Image schema Required"],
        // You can set a default for the entire image object if the data is often missing
        default: {
            filename: "default-filename",
            url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU8fZIwlWQ3qT8QPa9UuBK-BBux6HxNmbvbg&s" // A better default placeholder
        },
    },
    price:{
        type:Number,
        required:[true,"Price Required"],
        min: 0
    },
    location:{
        type:String,
        required:[true,"Location Required"],
    },
    country:{
        type:String,
        required:[true,"Country Required"],
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
    },
    coordinates: {
      type: [Number],
    }
  }
});


ListingSchema.post("findOneAndDelete",async (doc)=>{
    if(doc){
        await Review.deleteMany({_id:{$in:doc.reviews}});
    }
});

//Creating model for Listing

const Listing = mongoose.model("Listing",ListingSchema);

//Exporting the model

module.exports = Listing;