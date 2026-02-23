
const User = require("../models/user.js");


module.exports.userSignup = (req,res)=>{
    res.render("users/signup.ejs");
};


module.exports.userLogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.userLogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err)
            return next(err);
        req.flash("success","User logged out");
        res.redirect("/listings");
    });
};


module.exports.createUser =  async (req,res,next)=>{
    try{
        const {username,password,email} = req.body;
        let newUser = new User({username:username,email:email});
        let result = await User.register(newUser,password);
        req.flash("success","User Registered");
        req.login(newUser,(err)=>{
            if(err){
                return next(err);
            }
            res.redirect("/listings");
        });
        
    }catch(err){
        req.flash("error",`${err.message}`);
        res.redirect("/users/signup");
    }
};


module.exports.userValidation =  async (req,res,next)=>{
    req.flash("success","Welcome back to Globe Trot !");
    let redirectUrl = (res.locals.redirectUrl || "/listings");
    res.redirect(redirectUrl);
};