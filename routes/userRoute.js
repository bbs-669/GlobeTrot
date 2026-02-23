const express = require("express");
const router = express.Router();
const schemaValidation = require("../schemaValidation.js");
const passport = require("passport");
const {saveUrl} = require("../isLoggedin.js");
const {userSignup,userLogin,userLogout,createUser,userValidation} = require("../controller/userController.js");

const validateUser = (req,res,next)=>{
    const {error} = schemaValidation.userSchema.validate(req.body);
    if(error){
       req.flash("error",error.details.map(el=>el.message).join(", "));
       return res.redirect("/users/signup");
    }
    next();
}

//signup route

router.get("/signup",userSignup);

router.get("/login",userLogin);

router.get("/logout",userLogout);

router.post("/create",validateUser,createUser);

router.post("/validate",saveUrl,passport.authenticate("local",{failureRedirect:"/users/login",failureFlash:true}),userValidation);

module.exports = router;