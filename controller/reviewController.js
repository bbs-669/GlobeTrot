const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req,res,next)=>{
    try{
        let id = req.params.id;
        let listing = await Listing.findById(id);
        if(!listing)
            return next(new ExpressError(404,"Listing not found"));
        let review1 = new Review(req.body.reviews);
        console.log(req.user);
        review1.owner = req.user._id;
        await review1.save();
        listing.reviews.push(review1);
        await listing.save();
        console.log(listing);
        req.flash("success","Review Added");
        res.redirect(`/listings/${id}`);
    }catch(err){
        next(err);
    }
};


module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    // 1. Find listing
    const listing = await Listing.findById(id);
    if (!listing) {
      return next(new ExpressError(404, "Listing Not Found"));
    }

    // 2. Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new ExpressError(404, "Review Not Found"));
    }

    // 3. Authorization check
    if (!review.owner.equals(req.user._id)) {
      req.flash("error", "Unauthorized access");
      return res.redirect(`/listings/${id}`);
    }

    // 4. Delete review
    await Review.findByIdAndDelete(reviewId);

    // 5. Remove review reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    next(err);
  }
};