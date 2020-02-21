const express = require('express');
const {check,body}=require('express-validator/check');

const User=require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', 
    [
        body('email')
        .isEmail()
        .normalizeEmail(),
        body('password')
         .isLength({min:6})
         .trim()
    ],
    authController.postLogin);

router.post('/signup', 
 [ check('email')
    .isEmail()
    .custom((value,{req})=>{
       return User.findOne({email:value})
         .then(userDoc=>{
            if(userDoc){
               return Promise.reject('Email exists pick different one.')
             }
      });
  })
   .normalizeEmail(), 
   body('password','Password must be 6 characters and should contain special character')
    .isLength({min:6})
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value,{req})=>{
        if(value!==req.body.password)
         {
             throw new Error('Password should match');
         }
         return true;
    })
     ],
 authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;