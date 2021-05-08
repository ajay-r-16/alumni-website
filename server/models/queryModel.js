const mongoose = require('mongoose')
const queryTemp = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    alumni_id:{
        type: String,
        required: true
    },
    query:{
        type: String,
        required: true
    },
    action:{
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
   
    
});

module.exports =  mongoose.model("queryModel",queryTemp);