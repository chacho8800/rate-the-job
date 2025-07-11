const express = require("express")
const router = express.Router()

const User = require("../models/user.js")
const Post = require("../models/post.js");
const Profile = require("../models/profile.js");
const Review = require("../models/review.js");

// Index - View All Users
router.get("/users", async (req, res) => {
    try {
        const allUser =  await User.find({}).populate("profileId")
        
        console.log(allUser)
        res.render("users/index.ejs", {
            users : allUser
        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// Show - View a single user
router.get("/users/:userId", async (req, res) => {
    try {
        const userPosts = await Post.find({owner: req.params.userId})
        const userProfile = await User.findById(req.params.userId).populate("profileId")

      
        console.log("posttttttt",userProfile)
        console.log("userrr",userPosts)
        // console.log(userPosts)
        res.render("users/show.ejs", {
            userPosts : userPosts,
            user : userProfile,

        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router