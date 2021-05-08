
const express = require('express');
const User = require('../models/userDetailsModel');

var postModel = require('../models/postModel');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const passwordResetToken = require('../models/resetTokenModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const eventModel = require('../models/eventModel');

var queryModel = require('../models/queryModel');

var multer = require('multer');
 
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/post_images');
    },
    filename: (req, file, cb) => {
      const mimeType = file.mimetype.split('/');
      const fileType = mimeType[1];
      const fileName = file.originalname.split('.')[0] + '-'+Date.now()+ '.' + fileType;
      cb(null, fileName);
    },
  });

  const eventStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images/event_images');
    },
    filename: (req, file, cb) => {
      const mimeType = file.mimetype.split('/');
      const fileType = mimeType[1];
      const fileName = file.originalname.split('.')[0] + '-'+Date.now()+ '.' + fileType;
      cb(null, fileName);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  };
 
  const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
    'image'
  );

  const storageevent = multer({ storage: eventStorage, fileFilter: fileFilter }).single(
    'image'
  );



const router = express.Router();
const {request,response} = require('express');

router.post('/signup', (request,response)=>{
    
    const emailExist = User.findOne({email: request.body.email});
    if (!emailExist) return response.status(400).send("Email already exists");

    const hashPassword = bcrpyt.hash(request.body.password, 10);
    hashPassword.then((data)=>{

        const user = new User({
            fullname: request.body.fullname,
            email: request.body.email,
            password: data,
            phone: request.body.phone,
            dob: request.body.dob,
            department: request.body.department,
            designation: request.body.designation,
            institution: request.body.institution,
            batch: request.body.batch
        });
        user.save().then((data)=>{
            const token = jwt.sign({_id: data._id, role: data.role}, process.env.TOKEN_SECRET);
            response.status(200).json({token: token, role: data.role});
        }).catch((err)=>{
            response.status(400).json(err);
        })

    }).catch((err)=>{ console.log(err) });
        
});

router.get("/visit/:id",(req,res)=>{
    let id =  req.params.id;
    let ObjectId = require('mongodb').ObjectID;
    let oid = new ObjectId(id);
    User.findOne({ _id : oid },{_id: 0, fullname: 1, batch: 1, department: 1, institution: 1, dob: 1, designation: 1, email: 1}).then(profile=>{
        return res.status(200).send(profile);
    })
 
})

router.post('/answerQuery',(request, response)=>{
    const authHeader = request.headers.authorization;
    let ObjectId = require('mongodb').ObjectID;
    
    
    if (authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
            if (err) {
                return response.sendStatus(403);
            }
            if(user.role == "alumni"){
                let oid = new ObjectId(request.body.id);
                queryModel.findByIdAndUpdate({_id: oid}, {$set: {action: request.body.action}},{useFindAndModify: false}).then(data=>{
                    return response.status(200).json({message: "Reply updated"});
                })
            }
            else{
                return response.status(403).send("Access Denied");
            }

        })

    }

});

router.post('/resetPassword',async (req,res)=>{
    
        
        const user = await User.findOne({
            email:req.body.email
        });

        if (!user) {
            return res
            .status(409)
            .json({ message: 'Email does not exist' });
        }
        var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
        resettoken.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        passwordResetToken.deleteOne({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } });
        res.status(200).json({ message: 'Reset Password successfully.' });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            port:25,
            auth: {
              user: '30gajayraina@gmail.com',
              pass: 'ajayajay.'
            },
            tls: {
                rejectUnauthorized: false
            }
          });
        var mailOptions = {
        to: user.email,
        from: '30gajayraina@gmail.com',
        subject: 'Alumni portal Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'paste this token into your browser to complete the process:\n\n' +resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
              } 
        })
        })      
});

router.post('/validateToken',async (req,res)=>{

        const user = await passwordResetToken.findOne({
        resettoken: req.body.resettoken
        });
        if (!user) {
        return res
        .status(409)
        .json({ message: 'Invalid URL' });
        }
        User.findOne({ _id: user._userId }).then(() => {
        res.status(200).json({ message: 'Token verified successfully.' });
        }).catch((err) => {
        return res.status(500).send({ msg: err.message });
        });
});

router.post('/newPassword',async (req,res)=>{
    passwordResetToken.findOne({ resettoken: req.body.resettoken },async function (err, userToken, next) {
        if (!userToken) {
          return res
            .status(409)
            .json({ message: 'Token has expired' });
        }
        var hash = await bcrpyt.hash(req.body.newPassword, 10);
        User.findOne({
          _id: userToken._userId
        }).updateOne({password: hash }).then(data=>{
            passwordResetToken.deleteOne({ resettoken: req.body.resettoken });
                return res
                  .status(201)
                  .json({ message: 'Password reset successfully' });
        })
         
          
  
      })
})

router.post('/addQuery', (request,response)=>{
    
    const authHeader = request.headers.authorization;
    
    if (authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user)=>{
            if (err) {
                return response.sendStatus(403);
            }
            const data = new queryModel({
                user_id: user._id,
                alumni_id: request.body.alumni_id,
                query: request.body.query
            });
            
            data.save().then((msg)=>{
                
                response.status(200).json({message: "Query Added"});
            }).catch((err)=>{
                response.status(400).json(err);
            })

        })

    }
    
});

router.get('/getPosts',(req,res)=>{
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            
            postModel.find().then(data=>{
                return res.status(200).send(data);
            })

        });
    }
})

router.get('/getEvents/:status',(req,res)=>{
    const authHeader = req.headers.authorization;
    let status =  req.params.status;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            
            eventModel.find({status: status}).then(data=>{
                return res.status(200).send(data);
            })

        });
    }
})

router.get("/getQueries",(req,res)=>{
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            if(user.role=="student"){
                queryModel.find({user_id: user._id}).then((data)=>{
                
                    return res.status(200).send(data);
                }).catch((err)=>{
                    console.log(err);
                })
            }
            else{
                queryModel.find({alumni_id: user._id}).then((data)=>{
                
                    return res.status(200).send(data);
                }).catch((err)=>{
                    console.log(err);
                })
            }

            
        });
    }

});

router.post("/addPost",storage,(req,res)=>{
    var url = req.protocol + '://' + req.get("host");
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            
            const post = new postModel({
                user_id: user._id,
                message: req.body.message,
                poster: url+"/images/post_images/" + req.file.filename
            });
            console.log("saving");
            post.save().then((data)=>{
                return res.status(200).send({message: "saved"});
            }).catch(err=>{

            });
            
        });
    }
})

router.post("/updateEvent",(req,res)=>{
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

            eventModel.findOne({_id: req.body._id}).updateOne({venue: req.body.venue, organized_by: user._id, status: req.body.status}).then(data=>
            {
                res.status(200).send({message: "updated"});
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port:25,
                    auth: {
                      user: '30gajayraina@gmail.com',
                      pass: 'ajayajay.'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                  });
                var mailOptions = {
                to: user.email,
                from: '30gajayraina@gmail.com',
                subject: 'Alumni Events',
                text: 'Your Event have been approved' 
                
                }
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                      } 
                })
                })      
            })
    }


})

router.post("/addEvent",storageevent,(req,res)=>{
    var url = req.protocol + '://' + req.get("host");
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            
            const event = new eventModel({
                user_id: user._id,
                event_name: req.body.event_name,
                event_date: req.body.event_date,
                event_desc: req.body.event_desc,
                poster: url+"/images/event_images/" + req.file.filename
            });
            
            event.save().then((data)=>{
                return res.status(200).send({message: "saved"});
            }).catch(err=>{
                console.log(err);
            });
            
        });
    }
})

router.get("/search/:filter",(req, res)=>{

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
    
            data = JSON.parse(req.params.filter.slice(1));
            query_obj = [{ _id: {$ne: user._id} },{role: "alumni"}];
            for(let i in data){
                let a = {}
                
                if(i == "batch"){
                    a[i] = { $in: data[i] } ;
                }
                else{
                    let regex = data[i].join('|');
                    a[i] = {'$regex' : regex, '$options' : 'i'}
                    
                }
                query_obj.push(a);
                
            }
           
            let que = {$and : query_obj}
            
            User.find(que,{fullname: 1, batch: 1, department: 1, institution: 1}).then((data)=>{
                
                return res.status(200).send(data);
            }).catch((err)=>{
                console.log(err);
            })
        });
    } else {
        res.sendStatus(401);
    }
    
});



router.post("/login", (request,response)=>{
    
    User.findOne({email: request.body.email}).then((user)=>{
        if(user==null) return response.status(400).send("User doesn't exists");

        bcrpyt.compare(request.body.password, user.password).then((data)=>{
            if(data==false) return response.status(400).send("Invalid Password");
            
            const token = jwt.sign({_id: user._id, role: user.role}, process.env.TOKEN_SECRET);
            response.status(200).json({'token':token, role: user.role});
        }).catch((error)=>{ 
            return response.status(400).send(error);
        })

    }).catch((err)=>{ response.status(400).send(err) });


});

module.exports =  router;



