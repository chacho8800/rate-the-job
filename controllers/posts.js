const express = require('express');
const router = express.Router({mergeParams: true});

const Post = require("../models/post.js");
const User = require("../models/user.js")


/*

Action	           Route	                     HTTP Verb
Index	 ‘/users/:userId/posts’	                    GET
New	     ‘/users/:userId/posts/new’	                GET
Create	 ‘/users/:userId/posts’	                    POST
Show	 ‘/users/:userId/posts/:postId’	            GET
Edit	 ‘/users/:userId/posts/:postId/edit’	    GET
Update	 ‘/users/:userId/posts/:postId’	            PUT
Delete	 ‘/users/:userId/posts/:postId’	           DELETE

*/

// Index - Show all posts by a user
router.get("/", async (req, res) => {
    try {
    const currentUser = await User.findById(req.session.user._id)
    const posts = await Post.find({})

    res.locals.posts = posts

    res.render("posts/index.ejs",{
        user : currentUser
    })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// New - Show the form to create a new post
router.get("/new", async (req, res) => {
    res.render("posts/new.ejs")
})

// Create - Create a new post
router.post("/", async (req, res) => {
    try{
        const newPost = new Post(req.body)
        newPost.owner = req.session.user._id

        await newPost.save()

        res.redirect(`/users/${newPost.owner}/posts`)

    } catch(error) {
        console.log(error)
        res.redirect('/')
    }
})

// Show - show post in show page
router.get("/:postId", async (req, res) => {
    try {
        // Find post and populate owner’s profile and review details
        const currentUser = await User.findById(req.session.user._id)
        const currentPost = await Post.findById(req.params.postId)
        .populate({
            path : "owner",
            populate: { path : "profileId"}
        })
        .populate({
            path: "reviews",
            populate: {
                path: "reviewerId",
                select : "username"
            }
        })
        console.log(currentPost)

        res.render("posts/show.ejs",{
            post: currentPost,
            user: currentUser
        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})


// Edit - Show the edit form 
router.get("/:postId/edit", async (req,res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentPost = await Post.findById(req.params.postId).populate("owner")

        res.render("posts/edit.ejs",{
            user : currentUser,
            post : currentPost

        })
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// Update - Update the post
router.put("/:postId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentPost = await Post.findById(req.params.postId).populate("owner")

        currentPost.set(req.body)
        await currentPost.save()

        res.redirect(`/users/${currentUser._id}/posts/${req.params.postId}`)


    } catch(error) {
        console.log(error)
        res.redirect("/")
    }
})

// Delete - Delete the post
router.delete("/:postId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const currentPost = await Post.findById(req.params.postId).populate("owner")

        await currentPost.deleteOne()
        
        res.redirect(`/users/${currentUser._id}/posts`)


    } catch (error) {
        console.log(error)
        res.redirect("/")
    }

})




module.exports = router;