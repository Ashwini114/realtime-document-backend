const express = require("express")
const {body} = require('express-validator')
const router = express.Router();
const userController = require('../controllers/user')

router.post('/createUser',[
    body('first_name').not().isEmpty(),
    body('email').isEmail(),
    body('password').not().isEmpty()
    
],userController.createUser)

module.exports = router;