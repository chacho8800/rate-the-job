const express = require('express');
const router = express.Router()

const User = require("../models/user.js");
const Profile = require("../models/profile.js");
const session = require('express-session');


// Get the Profile form
router.get("/new", (req, res) => {
    res.render("profile/new.ejs")
})

// Create a new Profile
router.post("/", async (req, res) => {
    try {
        // Create a new profile
        const newProfile = await Profile.create(req.body)
        console.log(newProfile);

        // Find the user in the database
        const userInDatabase = await User.findById(req.session.user._id)
        console.log(userInDatabase);

        // Add the profile to the user
        userInDatabase.profileId = newProfile._id

        await userInDatabase.save()
        // Redirect to the home page
        res.redirect(`/`)
        

        
    } catch (error) {
        console.log(error);
        res.redirect("/profile/new");
    }
})

// Show The Profile Page
router.get("/:id", async (req, res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.params.id).populate("profileId")
        console.log(userInDatabase);
        
        res.locals.profile = userInDatabase.profileId

        res.render("profile/show.ejs",{
            user: userInDatabase
        })
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// Get the Edit Profile form
router.get("/:id/edit", async (req,res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.params.id).populate("profileId")

        res.locals.profile = userInDatabase.profileId
        res.render("profile/edit.ejs", {
            user: req.session.user
        })
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// Update the Profile
router.put("/:id", async (req, res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.params.id).populate("profileId");


        userInDatabase.profileId.set(req.body);
        await userInDatabase.profileId.save();
        res.redirect(`/profile/${userInDatabase._id}`)
        
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }


})



module.exports = router