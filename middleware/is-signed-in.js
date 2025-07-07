const isSignedIn = (req, res, next) => {
    if (req.seession.user) return next()
    res.redirect("/auth/sign-in")
    
}

module.exports = isSignedIn