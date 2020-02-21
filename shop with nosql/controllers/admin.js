const Product = require('../models/product');
const fileHelpher=require('../util/file').deleteFile;

const {validationResult}=require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing:false,
    hasError:false,
    errorMessage:null
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image)
   {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing:false,
      hasError:true,
      product:{
        title:title,
        description:description,
        price:price,
      },
      errorMessage:'Image could not be attached'
    });
   }
  const errors=validationResult(req);
  if(!errors.isEmpty())
    {
     return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/edit-product',
        editing:false,
        hasError:true,
        product:{
          title:title,
          description:description,
          price:price
        },
        errorMessage:errors.array()[0].msg
      });
    }

  const product=new Product({
    title:title,
    price:price,
    description:description,
    imageUrl:image.path,
     userId:req.user});
  product.save()
    .then(result=>{
      console.log('Created');
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
      // return res.status(500).render('admin/edit-product', {
      //   pageTitle: 'Add Product',
      //   path: '/admin/edit-product',
      //   editing:false,
      //   hasError:true,
      //   product:{
      //     title:title,
      //     description:description,
      //     price:price,
      //     imageUrl:imageUrl
      //   },
      //   errorMessage:'Database Operation Failed.Try After Some Time.'
      // });
    })
  

};

exports.getEditProduct = (req, res, next) => {
  const editMode=req.query.edit;
  if(req.query.edit!=="true")
  {
   return res.redirect('/');
  }

  const prodId=req.params.productId;
  Product.findById(prodId)
  .then(product=>{
    if(!product)
    {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product:product,
      hasError:false,
      errorMessage:null
    });
  })
 .catch(err=>{
  console.log(err);
  const error=new Error(err);
  error.httpStatusCode=500;
  return next(error);
 });
};

exports.postEditProduct=(req,res,next)=>{
  const prodId=req.body.productId;
  const updatedTitle=req.body.title;
  const image=req.file;
  const updatedPrice=req.body.price;
  const updatedDescription=req.body.description;
  const errors=validationResult(req);
  if(!errors.isEmpty())
    {
     return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing:true,
        hasError:true,
        product:{
          title:updatedTitle,
          description:updatedDescription,
          price:updatedPrice,
          _id:prodId
        },
        errorMessage:errors.array()[0].msg
      });
    }
  Product.findById(prodId)
   .then(product=>{
     if(product.userId.toString()!==req.user._id.toString())
      {
        return res.redirect('/');
      }
     product.title=updatedTitle;
     product.price=updatedPrice;
     product.description=updatedDescription;
     if(image)
     {
      fileHelpher(product.imageUrl);
      product.imageUrl=image.path;
     }
     
    return product.save()
    .then(()=>{
      console.log('Upadated Product!!');
      res.redirect('/admin/products'); 
    })
   })
   .catch(err=>{
    console.log(err);
    const error=new Error(err);
    error.httpStatusCode=500;
    return next(error);
   });
  
}

exports.getProducts = (req, res, next) => {
   Product.find({userId:req.user._id})
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err=>{
      console.log(err);
      const error=new Error(err);
      error.httpStatusCode=500;
      return next(error);
     });
};

exports.deleteProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findById(prodId)
  .then(product=>{
    if(!product){
      return next(new Error('No Product Found'));
    }
    fileHelpher(product.imageUrl);
    return Product.deleteOne({_id:prodId,userId:req.user._id})
  })
  .then(()=>{
      console.log('Deleted!!');
      res.status(200).json({message:'Success'});
    })
    .catch(err=>{
      res.status(500).json({message:'Deleting Product is Failed'});
    });
  
}