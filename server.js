//Server
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const ExpressError = require("./utils/expressError.js");
const listingRoute = require("./routes/listingRoute.js");
const reviewRoute = require("./routes/reviewRoute.js");
const userRoute = require("./routes/userRoute.js");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user.js");
const dbUrl = process.env.ATLAS_URL;
const MongoStore = require("connect-mongo").default;




//setting up the app
app.set("view engine","ejs");
app.set("views","./views");
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.loggedIn = req.user;
    next();
});

passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());



//Routes
app.use("/listings/:id/reviews",reviewRoute);
app.use("/listings",listingRoute);
app.use("/users",userRoute);


//creating connection with the database (MongoDB)
mongoose.connect(dbUrl).then(()=>console.log("Connected with database")).catch(err=>console.log(err));

//making app listen to port 8080
app.listen(8080,()=>{
    console.log("App listening on port 8080");
});


//Helper functions
const handleValidation = (err,res)=>{
    let message = err.message   ||  "Valdation failed";
    res.status(400).render("listings/error.ejs",{message});
}

const handleCastException = (err,res)=>{
    let message = err.message    ||  "Cast Exception";
    res.status(500).render("listings/error.ejs",{message});
}



//Error Handlers

//If no route matches
app.use((req,res,next)=>{
    console.log(req.originalUrl);
    next(new ExpressError(404,"Page not found"));
});


//General Error Handler
app.use((err,req,res,next)=>{
    let name = err.name;
    if(name === "ValidationError")
        return handleValidation(err,res); 
    else if(name == "CastError")
        return handleCastException(err,res);
    let {status=500,message="Something went wrong"}=err;
    console.log(err);
    res.status(status).render("listings/error.ejs",{message});
});

