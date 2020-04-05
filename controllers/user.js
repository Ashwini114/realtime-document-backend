const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const io = require('../socket')



exports.getUsers = (req,res,next) =>{
    User.find({})
    .then((result)=>{
        res.status(200).json({
            users : result,
            message : "User data"
       })
    })
    .catch((err)=>{
        res.status(400).json({
            message : "An error occured while fetching data"
       })
    })

};

exports.loginUser = (req,res,next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
         res.status(400).json({'message':"Validation failed"})
    }
    const email = req.body.email;
    const password = req.body.password;
    let loggedUser;
    
    
    User.findOne({'email':email})
    .then(user=>{
        if(!user)
         res.status(404).json({'message':"User does not exixts"})
        loggedUser = user;
       return  bcrypt.compare(password,user.password)
    })
    .then(isEqual=>{
        if(isEqual)
        {
            User.updateOne({ email: email }, { $set: { online: true } })
            .then((updatedUser)=>{
                io.getio().emit('online',{action:"online",data:loggedUser})
                res.status(200).json({'message' : 'success',loggedUser})
            })
            .catch(err=>{
                console.log(err)
                res.status(404).json({'message' : 'An error occured while logging in. Please try again'})
            })
            
        }
        else
         res.status(404).json({'message' : 'Invalid credentials'})
    })
    .catch(err=>{
        console.log(err)
         res.status(404).json({'message' : 'Invalid credentials'})
    })
    // console.log(email);
    // res.status(200).json({
    //     message : "User successfully logged in",
    //     user : {id:1,name:"Ashwini"}
    // })
} 

exports.createUser = (req,res,next) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        console.log(errors)
         res.status(400).json({'message':"Please fill in valid information in the required fields"})
    }
    
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const  email = req.body.email;
    const  password = req.body.password;
    const userExists = User.findOne({'email':email})
    .then((userData)=>{
        if(userData)
         res.status(400).json({'message':"Entered email Id already exists."})
        else
        {
            bcrypt.hash(password,12)
            .then(hashedPass=>{
                const user = new User({
                    first_name:first_name,
                    last_name : last_name,
                    email : email,
                    password : hashedPass
                })
                return user.save()
            })
            .then(response=>{
                
                 res.status(200).json({
                    "message" : "User created successfully",
                    
                })
            })
            .catch(err=>{
                console.log(err)
                 res.status(400).json({
                    "message" : "Error",
                    
                })
            })
        }

    })

}
