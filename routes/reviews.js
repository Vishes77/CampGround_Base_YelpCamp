const express = require('express');
const router = express.Router({mergeParams:true}); // for using same params has in params of index page.
const catchAsync = require('../utils/catchAsync');
const { reviewSchema } = require('../schemas');
const Review = require('../models/review');
const campground = require('../models/campgrounds');
const ExpressError = require('../utils/ExpressError');

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map( el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}


router.post('/', validateReview , catchAsync(async(req,res)=>{
    const camp = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // This is for pulling/deleting the review inside campground schema.
    await Review.findByIdAndDelete(reviewId); // this is complete removal from reviews schema as one to many realtion is here and one campground has many reviews possible.
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;