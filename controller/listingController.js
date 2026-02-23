const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MapToken });


module.exports.renderCreateForm = (req, res) => {
    res.render("listings/create.ejs");
    console.log(req.user);
};


module.exports.createListing = async (req, res, next) => {
    try {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.location,
            limit: 1
        })
            .send();


        let listing1 = new Listing(req.body);
        if (!req.file) {
            req.flash("error", "Image is required");
            return res.redirect("/listings/new");
        }
        listing1.image.url = req.file.path;
        listing1.image.filename = req.file.filename;
        listing1.geometry = response.body.features[0].geometry;
        listing1.owner = req.user._id;   // safe because isLoggedIn runs first

        await listing1.save();

        req.flash("success", "Listing created");
        res.redirect("/listings");


    } catch (err) {
        next(err);
    }
};


module.exports.renderHomePage = async (req, res,next) => {
    try {
        let { destination } = req.query;
        if (destination) {
            const filteredListings = await Listing.find({
                $or: [
                    { location: { $regex: destination, $options: "i" } },
                    { country: { $regex: destination, $options: "i" } },
                    { title: { $regex: destination, $options: "i" } }
                ]
            });
        res.render("listings/home.ejs", { result: filteredListings });
    } else {
        const result = await Listing.find({});
        res.render("listings/home.ejs", { result });
    }
} catch (err) {
    next(err);
}
};



module.exports.renderViews = async (req, res, next) => {
    try {
        let id = req.params.id;
        let details = await Listing.findById(id).populate({ path: "reviews", populate: { path: "owner" } }).populate("owner");
        if (!details) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }
        console.log(details);
        res.render("listings/view.ejs", { details, currUser: req.user, mapToken: process.env.MAP_TOKEN });
    } catch (err) {
        next(err);
    }
};


module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Listing.findById(id);

    if (!data) {
      req.flash("error", "Listing Not Found");
      return res.redirect("/listings");
    }

    if (!data.owner._id.equals(req.user._id)) {
      req.flash("error", "Unauthorized access");
      return res.redirect(`/listings/${id}`);
    }

    let originalImageUrl = data.image.url;
    if (data.image && data.image.url) {
      originalImageUrl = data.image.url.replace(
        "/upload",
        "/upload/w_300,h_300"
      );
    }

    res.render("listings/edit.ejs", { data, originalImageUrl });
  } catch (err) {
    next(err);
  }
};


module.exports.updateListing = async (req, res, next) => {
    try {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }
        Object.assign(listing, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            location: req.body.location,
            country: req.body.country
        });
        if (req.file) {
            let newImage = req.file.path;
            let newFilename = req.file.filename;
            listing.image.url = newImage;
            listing.image.filename = newFilename;
        }
        await listing.save();
        req.flash("success", "Edited Successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        next(err);
    }
};


module.exports.deleteListing = async (req, res, next) => {
    try {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing Not Found");
            return res.redirect("/listings");
        }
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "Unauthorised access");
            return res.redirect(`/listings/${id}`);
        }
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Deleted successfully");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};