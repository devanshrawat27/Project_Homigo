const mongoose = require('mongoose');
const schema = mongoose.Schema;

// create shcmea for review model
const reviewSchema = new schema({
    comment:String,
    rating:{
        type:Number,
        min:0,
        max:5
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

module.exports=mongoose.model("review",reviewSchema);