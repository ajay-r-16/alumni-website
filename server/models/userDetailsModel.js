const mongoose = require('mongoose')
const userDetailsTemp = new mongoose.Schema({
    fullname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    password:{
        type: String,
        required: true 
    },
    dob:{
        type: Date,
        required: true
    },
    department:{
        type: String,
        required: true
    },
    batch:{
        type: Number,
        required: true
    },
    institution:{
        type: String,
        required: true
    },
    designation:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "student",
        required: true
        
    },
    isprofileupdated:{
        type: Boolean,
        default: false,
        required: true
    },
    isverified:{
        type: Boolean,
        default: false,
        required: true
    },

    created: {
        type: Date,
        default: Date.now
    }


});

// userDetailsTemp.methods.comparePassword = (password) => {
//     return bcrypt.compareSync(password, this.hash_password);
//   };
module.exports =  mongoose.model("user_details",userDetailsTemp);
