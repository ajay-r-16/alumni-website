const mongoose = require('mongoose')
const postTemp = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    poster:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    
});

module.exports =  mongoose.model("postModel",postTemp);