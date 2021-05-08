const mongoose = require('mongoose')
const eventTemp = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    event_name:{
        type: String,
        required: true
    },
    event_date:{
        type: String,
        required: true
    },
    event_desc:{
        type: String,
        required: true
    },
    poster:{
        type: String,
    },
    status:{
        type: String,
        default: "pending"
    },
    venue:{
        type:String,
        default:""
    },
    
    organized_by:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

    
});

module.exports =  mongoose.model("eventModel",eventTemp);