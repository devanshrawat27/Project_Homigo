
const Listing = require("./models/listing");
const ExpressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");


module.exports.isLogin = (req,res,next)=>{
     if(!req.isAuthenticated()){
     //redircet url 
     req.session.redirectUrl=req.originalUrl;
    req.flash("error","You must be signed in first!");
    return res.redirect("/login");
  }
  next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
};


module.exports.isowner= async(req,res,next)=>{
  const { id } = req.params;
     let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
      req.flash("error", "You don't have permission to this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

// ✅ validate listing - MUST run AFTER file upload middleware
module.exports.validateListing = (req, res, next) => {
  
  // ✅ Build validation object from form data + uploaded file
  const listingInput = {
    listing: {
      // All form fields use bracket notation: name="listing[title]" → req.body.listing.title
      title: req.body.listing?.title || "",
      description: req.body.listing?.description || "",
      price: req.body.listing?.price ? Number(req.body.listing.price) : 0,
      location: req.body.listing?.location || "",
      country: req.body.listing?.country || "",
    },
  };

  // ✅ Only add image if a new file was uploaded
  if (req.file) {
    listingInput.listing.image = {
      url: req.file.path,           // Cloudinary secure URL (e.g., https://res.cloudinary.com/...)
      filename: req.file.filename,  // Cloudinary public_id
    };
  }

  // ✅ Validate against Joi schema in schema.js
  const { error } = listingSchema.validate(listingInput);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }

  // ✅ Attach validated data to request for controller to use
  req.validListing = listingInput.listing;
  next();
}


// ✅ Middleware: validate Review
module.exports.validateReview=(req, res, next)=> {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
}


module.exports.isAuthor= async(req,res,next)=>{
  const { reviewId } = req.params;
     let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
      req.flash("error", "You are not the author of this review!");
      return res.redirect(`/listings/${req.params.id}`);
    }
    next();
};