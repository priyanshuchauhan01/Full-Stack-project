const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Reviews.js"); // Add this line

const defaultImageURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo45S78lc4q0cjwlItrGFw2GMeRu9XPDnv5A&usqp=CAU"; // Replace this with your default image link

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: defaultImageURL,
        }
    },
    
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review", // Corrected reference to the Review model
        }
    ]
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
      await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
