const express = require("express")
const {body} = require('express-validator')

const userController = require("../controllers/user")

const router = express.Router();

router.get('/users',userController.getUsers)

router.post('/login',[
    body('email').isEmail(),
    body('password').not().isEmpty()
],

userController.loginUser)



module.exports = router;