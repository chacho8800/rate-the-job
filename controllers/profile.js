const express = require('express');
const router = express.Router()

const User = require("../models/user.js");
const Profile = require("../models/profile.js");



// Get the Profile form
router.get("/new", (req, res) => {
    res.render("profile/new.ejs")
})

// Create a new Profile
router.post("/", async (req, res) => {
    try {
        // Create a new profile
        const newProfile = await Profile.create(req.body)

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
router.get("/", async (req, res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.session.user._id).populate("profileId")
        console.log(userInDatabase);

        // If the user does not have a profile, redirect to the new profile page
        if (!userInDatabase.profileId) {
            return res.redirect("/profile/new")
        }
        
        res.render("profile/show.ejs",{
            user: userInDatabase,
            profile: userInDatabase.profileId
        })
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// Get the Edit Profile form
router.get("/edit", async (req,res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.session.user._id).populate("profileId")

        res.render("profile/edit.ejs", {
            user: req.session.user,
            profile: userInDatabase.profileId
        })
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

// Update the Profile
router.put("/", async (req, res) => {
    try {
        // Find the profile in the database
        const userInDatabase = await User.findById(req.session.user._id).populate("profileId");

        userInDatabase.profileId.set(req.body);
        await userInDatabase.profileId.save();
        res.redirect(`/profile`)
        
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }


})



module.exports = router