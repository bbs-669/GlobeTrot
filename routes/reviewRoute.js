const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const schemaValidation = require("../schemaValidation.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn} = require("../isLoggedin.js");
const {createReview,deleteReview } = require("../controller/reviewController.js");

const validateReview = (req,res,next)=>{
    const {error} = schemaValidation.reviewSchema.validate(req.body.reviews);
    if(error){
        return next(new ExpressError(400,error.details.map(el=>el.message).join(",")));
    }
    next();
};

router.get("/",(req,res)=>{
    // let reviewBody = res.locals.body || {};
    req.flash("success","You can add a review now");
    res.redirect(`/listings/${id}`);
});


//Review route
router.post("/",isLoggedIn,validateReview,createReview);


//Delete Route for reviews
router.delete("/:reviewId",isLoggedIn,deleteReview);



module.exports = router;