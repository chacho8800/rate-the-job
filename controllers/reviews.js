const express = require("express")
const router = express.Router({mergeParams: true})

const Review = require("../models/review.js")
const Post = require("../models/post.js");
const User = require("../models/user.js");

// Create a review
router.post("/", async (req, res) => {
  const { rating, comment } = req.body;
  const { postId, userId } = req.params;

  try {
    
    const newReview = new Review({
        rating,
        comment,
        reviewerId: req.session.user._id,
        postId
    });

    await newReview.save();

    const post = await Post.findById(postId)

    // Add review to post's reviews array
    post.reviews.push(newReview._id);
    await post.save();

    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (error) {
    console.error("Review creation failed:", error);
    res.redirect("/");
  }
});

router.delete("/:reviewId", async (req, res) => {
  const { userId, postId, reviewId } = req.params;

  try {
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/users/${userId}/posts/${postId}`);
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});


module.exports = router