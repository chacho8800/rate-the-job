const express = require('express');
const router = express.Router();

const Post = require("../models/post.js");


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
    const posts = await Post.find({owner: req.session.user._id}).populate("owner")

    res.locals.posts = posts
    // console.log(posts)

    res.render("posts/index.ejs")
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
        // console.log(newPost)
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
        const currentPost = await Post.findOne({
            owner: req.session.user._id,
            _id: req.params.postId
        }).populate("owner")

        console.log(currentPost)

        res.render("posts/show.ejs",{
            post: currentPost
        })

    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})


// Edit - Show the edit form 
router.get("/:postId/edit", async (req,res) => {
    try {
        const currentPost = await Post.findOne({
            owner: req.session.user._id,
            _id: req.params.postId
        }).populate("owner")

        res.locals.post = currentPost

        res.render("posts/edit.ejs")
    } catch (error) {
        console.log(error)
        res.redirect("/")
    }
})

// Update - Update the post
router.put("/:postId", async (req, res) => {
    try {
        const currentPost = await Post.findOne({
            owner: req.session.user._id,
            _id: req.params.postId
        }).populate("owner")

        currentPost.set(req.body)
        await currentPost.save()

        res.redirect(`/users/${currentPost.owner._id}/posts`)


    } catch(error) {
        console.log(error)
        res.redirect("/")
    }
})

// Delete - Delete the post
router.delete("/:postId", async (req, res) => {
    try {
        const currentPost = await Post.findOne({
            owner: req.session.user._id,
            _id: req.params.postId
        }).populate("owner")

        await currentPost.deleteOne()

        // console.log(currentPost)

        res.redirect(`/users/${currentPost.owner._id}/posts`)


    } catch (error) {
        console.log(error)
        res.redirect("/")
    }

})




module.exports = router;