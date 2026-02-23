const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
let {data} = require("./data.js");

mongoose.connect("mongodb://127.0.0.1:27017/globetrot");



const start = async ()=> {
    try{
        await Listing.deleteMany({});

        data = data.map((element)=>({...element,"owner":'69630e307c2eafb741766545'}));
        await Listing.insertMany(data);
        
        await console.log("Inserted");
        await mongoose.disconnect();
    }catch(err){
        console.log(err);
    }
}

start();