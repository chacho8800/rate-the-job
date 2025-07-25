const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: false,
    min: 1,           
    max: 5            
  },
  comment: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;