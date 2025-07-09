const express = require("express")
const router = express.Router()

const User = require("../models/user.js")
const Post = require("../models/post.js");
const Profile = require("../models/profile.js")

// Index - View All Users
router.get("/users", async (req, res) => {
    try {
        const currentUser =  await User.find({}).populate("profileId")
        const userPosts = await Post.find({}).populate("owner")
        console.log(userPosts)
        console.log(currentUser)
        res.render("users/index.ejs", {
            users : currentUser
        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// Show - View a single user
router.get("/users/:userId", async (req, res) => {
    try {
        const userPosts = await Post.find({owner: req.params.userId}).populate("owner")
        const userProfile = await User.findById(req.params.userId).populate("profileId");
        
        console.log(userProfile)
        // console.log(userPosts)
        res.render("users/show.ejs", {
            userPosts : userPosts,
            profile : userProfile

        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router