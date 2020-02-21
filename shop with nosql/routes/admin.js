const express = require('express');
const {body}=require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth=require('../middleware/is-auth');

const router = express.Router();


router.get('/add-product', adminController.getAddProduct);

router.get('/products',adminController.getProducts);

router.post('/add-product',
[
  body('title')
   .isString()
   .isLength({min:3})
   .trim(),
   body('price')
   .isFloat(),
   body('description')
    .isLength({min:6,max:400})
    .trim()
] ,
isAuth,adminController.postAddProduct);

router.get('/edit-product/:productId',adminController.getEditProduct);

router.post('/edit-product',[
    body('title')
     .isString()
     .isLength({min:3})
     .trim(),
     body('price')
     .isFloat(),
     body('description')
      .isLength({min:6,max:400})
      .trim()
  ] ,
   adminController.postEditProduct);

 router.delete('/product/:productId',adminController.deleteProduct);

module.exports = router;
