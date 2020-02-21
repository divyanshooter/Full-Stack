const path = require('path');
const fs=require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const MongodbStore=require('connect-mongodb-session')(session); 
const csrf=require('csurf');
const flash =require('connect-flash');
const multer=require('multer');
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

const errorController = require('./controllers/error');

const MONGO_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-h4th2.mongodb.net/${process.env.MONGO_DB}`;
const csrfProtection=csrf();

const fileStorage=multer.diskStorage({
 destination:(req,file,cb)=>{
     
     cb(null,'images');
 },
 filename:(req,file,cb)=>{
     cb(null, file.originalname);
    }
 });

 const fileFilter=(req,file,cb)=>{
     console.log(file.mimetype);
     if(file.mimetype==='image/png' || file.mimetype==='image/jpg' ||file.mimetype==='image/jpeg')
       {
           cb(null,true);
       }
       else {
           cb(null,false);
       }
 }

const app = express();
const accessStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});
const store=new MongodbStore({
    uri:MONGO_URI,
    collection:'sessions',
})
const User=require('./models/user');
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes= require('./routes/auth');

app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessStream}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}));

app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedIn;
    res.locals.csrfToken=req.csrfToken();
    next();
});

app.use((req,res,next)=>{
    if(!req.session.user)
     {
         return next();
     }
    User.findById(req.session.user._id)
    .then(user=>{
        if(!user)
         {
             return next();
         }
        req.user=user
        next();
    })
    .catch(err=>{
        next(new Error(err));
    });
    
})



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/404',errorController.get404);
app.use('/500',errorController.get500)

app.use((error,req,res,next)=>{
    res.redirect('/500');
})
mongoose.connect(MONGO_URI)
 .then(()=>{
     console.log('connected');
     app.listen(process.env.PORT || 4000);
 })
 .catch(err=>console.log(err));
