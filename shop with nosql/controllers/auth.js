const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const nodemailer=require('nodemailer');
const sendgridTransport=require('nodemailer-sendgrid-transport');
const { validationResult}=require('express-validator/check');

const User = require('../models/user');

const transporter= nodemailer.createTransport(sendgridTransport({
   auth:{
     api_key:'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'
   }
}))

exports.getLogin = (req, res, next) => {
  let message=req.flash('error');
  if(message.length>0)
    {
      message=message[0];
    }
    else
    {
      message=null;
    }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message,
    oldInput:{
      email:"",
      password:""
   },
   validationError:[]
  });
};

exports.getSignup = (req, res, next) => {
  let message=req.flash('error');
  if(message.length>0)
    {
      message=message[0];
    }
    else
    {
      message=null;
    }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage:message,
    oldInput:{
      username:"",
      email:"",
      password:"",
      confirmPassword:""
     },
     validationError:[]
  });
};

exports.postLogin = (req, res, next) => {
  const email=req.body.email;
  const password=req.body.password;
  const errors=validationResult(req);
  if(!errors.isEmpty())
    {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage:errors.array()[0].msg,
        oldInput:{
           email:email,
           password:password
        },
        validationError:errors.array()
      });
    }
    return User.findOne({email:email})
    .then(user=>{
       if(!user){
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage:'Invalid email or password.',
              oldInput:{
                email:email,
                password:password
              },
              validationError:[{param:'email'}]
            });
        }
        bcrypt.compare(password,user.password)
        .then(doMatch=>{
          if(doMatch) 
           {
             req.session.isLoggedIn = true;
             req.session.user = user;
             return req.session.save(err => {
               res.redirect('/');
             });
           }
           else{
             return res.status(422).render('auth/login', {
               path: '/login',
               pageTitle: 'Login',
               errorMessage:'Invalid email or password.',
               oldInput:{
                  email:email,
                  password:password
               },
               validationError:[{param:'email',param:'password'}]
             });
           }
        })
         .catch(err=>{
           console.log(err);
          const error=new Error(err);
          error.httpStatusCode=500;
          return next(error);
         })
   })
   .catch(err=>{
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
  })
    

};

exports.postSignup = (req, res, next) => {
      const username=req.body.username;
      const email=req.body.email;
      const password=req.body.password;
      const error=validationResult(req);
      if(!error.isEmpty())
      {
        return res.status(422)
         .render('auth/signup', {
          path: '/signup',
          pageTitle: 'Signup',
          errorMessage:error.array()[0].msg,
          oldInput:{
            username:username,
            email:email,
            password:password,
            confirmPassword:req.body.confirmPassword
            },
            validationError:error.array()
        });
      }
      bcrypt.hash(password,12)
             .then(hashPassword=>{
                  const user=new User({
                          username:username,
                          email:email,
                          password:hashPassword,
                          cart:{items:[]}
                       });
                 return user.save();
               })
               .then(()=>{
                   res.redirect('/login');
                    return transporter.sendMail({
                      to:email,
                      from:'dc_shop@dc.com',
                      subject:'Signup Successful!!',
                      html:'<h1>Divyanshu Welcomes You To DC-Shop.Thanks For Sigining Up!</h1>'
                    });
                     
               })
          .catch(err=>{
            console.log(err)
            const error=new Error(err);
            error.httpStatusCode=500;
            return next(error);
          });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset=(req,res,next)=>{
  let message=req.flash('error');
  if(message.length>0)
    {
      message=message[0];
    }
    else
    {
      message=null;
    }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage:message
  });
}

exports.postReset=(req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token=buffer.toString('hex');
    User.findOne({email:req.body.email})
     .then(user=>{
       if(!user){
         req.flash('error','No account found for given email');
         return res.redirect('/reset');
       }
       user.resetToken=token;
       user.resetTokenExpiration=Date.now()+360000;
       return user.save();
     })
      .then(()=>{
        res.redirect('/');
        transporter.sendMail({
          to:req.body.email,
          from:'dc_shop@dc.com',
          subject:'Password Reset',
          html:`
              <p>You requested to change Password
              <p>To change password click on the given <a href="http://localhost:4000/reset/${token}">Link</a></p>
              `

        })
        .catch(err=>{
          console.log(err);
          const error=new Error(err);
          error.httpStatusCode=500;
          return next(error);
        });
      })
  })
};

exports.getNewPassword=(req,res,next)=>{
  const token=req.params.token;
  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}})
   .then(user=>{
     if(!user)
      {
         req.flash('error','Invalid Request Not Authoried');
          return res.redirect('/login');
      }
        let message=req.flash('error');
        if(message.length>0)
          {
            message=message[0];
          }
          else
          {
            message=null;
          }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage:message,
          userId:user._id.toString(),
          passwordToken:token
        });
   })
   .catch(err=>{
     console.log(err);
     const error=new Error(err);
     error.httpStatusCode=500;
     return next(error);
    });
  
}

exports.postNewPassword=(req,res,next)=>{
   const password=req.body.password;
   const userId=req.body.userId;
   const passwordToken=req.body.passwordToken;
   
   let resetUser;
   User.findOne({
     resetToken:passwordToken,
     resetTokenExpiration:{$gt:Date.now()},
     _id:userId
   })
    .then(user=>{
       if(!user)
         {
           console.log('Not found');
           return res.redirect('/login');
         }
         resetUser=user;
         return bcrypt.hash(password,12);
    })
    .then(hashPassword=>{
       resetUser.password=hashPassword;
       resetUser.resetToken=undefined;
       resetUser.resetTokenExpiration=undefined;
       return resetUser.save();
    })
    .then(()=>{
       return res.redirect('/login');
    })
    .catch(err=>{
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
    });
}