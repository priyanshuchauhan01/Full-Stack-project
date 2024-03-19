const express = require("express");
const app = express();
const session = require("express-session");
const flash = require('express-flash');
const MongoStore = require("connect-mongo");
const Joi = require('joi');
const mongoose = require("mongoose");

const Listing = require("./model/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./util/wrapasync.js");   
const ExpressError = require("./util/expresserror.js");
const Review = require("./model/Reviews.js"); 
const ReviewsSchema = require('./schema.js');
const User = require("./model/user.js");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {isloggedIn} = require("./middleware.js")
const {saveRedirectUrl} = require("./middleware.js")


mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); 

const sessionOption = { 
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expire : Date.now() + 100 *60 *60 *24 *3,
    maxAge :  100 *60 *60 *24 *3,
    httponly : true
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration 
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Make the current user available in templates
  next();
});

// Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));
 
// New Route
app.get("/listings/new", isloggedIn , (req, res) => {
  res.render("listings/new.ejs");
});

// Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  if(!listing){
    req.flash("error" , "Listing does not exit");
    res.redirect("/listings")
  }
  res.render('listings/show', { listing, imageUrl: listing.image.url  });
}));

// Create Route
app.post("/listings", isloggedIn , wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "New Listing Created");
  res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit",isloggedIn , wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if(!listing){
    req.flash("error" , "Listing does not exit");
    res.redirect("/listings")
  }
 res.render("listings/edit.ejs", { listing });
}));

// Update Route with proper error handling
app.put("/listings/:id", isloggedIn , wrapAsync(async (req, res, next) => {
  try {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedListing) {
      throw new ExpressError(404, "Listing not found");
    }
    req.flash("success" , "New Listing Updated");
    res.redirect(`/listings/${updatedListing._id}`);
  } catch (err) {
    next(err);
  }
}));

// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  console.log("listing deleted");
  req.flash("success", "New Listing Deleted");
  res.redirect("/listings");
}));

const validateReview = (req, res, next) => {
  const { error } = ReviewsSchema.validate(req.body.review);
 if (error) {
    const errMsg = error.details.map((el) => el.message).join(', ');
    return res.status(400).send(`Validation error: ${errMsg}`);
  }
  next();
}; 

// Reviews route 
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }const newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
  req.flash("success", "New Review added");
  res.redirect(`/listings/${req.params.id}`);
}));

// Delete Review Route         
app.delete("/listings/:listingId/reviews/:reviewId", wrapAsync(async (req, res) => {
  await Review.findByIdAndDelete(req.params.reviewId); // Deleting the review by its ID
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${req.params.listingId}`);
}));


app.get("/login", async (req, res) => {
  res.render("users/login.ejs");
});

app.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});
   
app.post("/login", saveRedirectUrl, passport.authenticate('local', { 
  failureRedirect: '/login', 
  failureFlash: true 
}), async (req, res) => {
  req.flash("success", "Welcome back to Wonder");
  res.redirect(res.locals.redirectUrl || '/listings');
});

app.post("/signup", wrapAsync(async (req, res) => {
  let { username, email, password } = req.body;
  const newUser = new User({ email, username });
  try {
    // Register the user using Passport
   const registeruser =  await User.register(newUser, password);
   req.login(registeruser, (err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "Welcome to Wonder");
    res.redirect("/listings"); 
   });
   } catch (err) {
    console.error(err);
    // Handle registration failure if needed
    req.flash("error", "Registration failed. Please try again.");
    res.redirect("/signup");
  }
}));

app.get("/logout" , (req , res , next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success" , "you are logged out!");
    res.redirect("/listings")
  });
});

// Add 404 error handling for unknown routes
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});
// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(`Error ${statusCode}: ${message}`);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});