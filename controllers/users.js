const express = require("express")
const router = express.Router()

const User = require("../models/user.js")
const Post = require("../models/post.js");


// Index - View All Users
router.get("/users", async (req, res) => {
    try {
        const allUser =  await User.find({}).populate("profileId")
        
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
        const userPosts = await Post.find({ owner: req.params.userId }).populate({
            path: "reviews",
            populate: {
                path: "reviewerId",
                select: "username"
            }
        });
        const userProfile = await User.findById(req.params.userId).populate("profileId")

        res.render("users/show.ejs", {
            userPosts : userPosts,
            currentUser : userProfile,

        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

module.exports = router