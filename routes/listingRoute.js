const express = require("express");
const router = express.Router({ mergeParams: true });
const schemaValidation = require("../schemaValidation.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn} = require("../isLoggedin.js");
const {renderCreateForm,createListing,renderHomePage,renderViews,renderEditForm,updateListing,deleteListing} = require("../controller/listingController.js");
const multer = require("multer");
const {storage} = require("../cloudSetup.js");
const upload = multer({ storage });

const validateListing = (req,res,next)=>{
    const {error} = schemaValidation.listingSchema.validate(req.body);
    if(error){
        return next(new ExpressError(400,error.details.map(el=>el.message).join(",")));
    }
    next();
};




//Edit Route
//->Form rendering Route
router.get("/:id/change",isLoggedIn,renderEditForm);
//->Editing Route
router.patch("/:id/edit",isLoggedIn,upload.single("image[url]"),validateListing,updateListing);

//Delete Route
router.delete("/:id/delete",isLoggedIn,deleteListing);


//Create Route
//->rendering form to get details
router.get("/new",isLoggedIn,renderCreateForm);
//->creating a new entry in the database
router.post("/create", isLoggedIn,upload.single("image[url]"), validateListing, createListing);

//Home Route
router.get("/",renderHomePage);

//View Route
router.get("/:id",renderViews);


module.exports = router;






