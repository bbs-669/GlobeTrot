const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.session.body = req.body;
        req.flash("error", "Login required");
        return res.redirect("/users/login");
    }      
    next(); 
}

const saveUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        res.locals.body = req.session.body;
    }
    next();
}

module.exports = {isLoggedIn, saveUrl};


