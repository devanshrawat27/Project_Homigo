const mongoose = require('mongoose');
const schema = mongoose.Schema;
const review = require('./reviews.js');

const listingschema = new schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  location: String,
  image: {
    url:String,
    filename: String,
    
  },
  country: String,
  reviews:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'review',
    },
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  }
});

listingschema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await review.deleteMany({_id:{ $in:listing.reviews}});
  }
 });
  
const listing = mongoose.model("listing", listingschema);
module.exports = listing;
