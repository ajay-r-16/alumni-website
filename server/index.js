const router = require('./routes/routes');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
dotenv.config();
mongoose.connect(process.env.DATABASE_ACCESS,{useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/',router);
app.use("/images", express.static(path.join("server/images/post_images")));  
app.set("view engine", "ejs");
mongoose.set('useCreateIndex', true);


app.listen(5000,()=>{console.log("Server is up and running")}); 



