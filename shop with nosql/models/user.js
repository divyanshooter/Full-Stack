const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const userSchema=new Schema({
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  resetToken:String,
  resetTokenExpiration:Date,
  cart:{
    items:[{productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},qty:{type:Number,required:true}}]
  }
});

userSchema.methods.addToCart=function(product){
  const updatedCartItems=[...this.cart.items];
         const cartProductIndex=this.cart.items.findIndex(cp=>cp.productId.toString()===product._id.toString());
         let newQuantity=1;
         if(cartProductIndex>=0) 
           {
             newQuantity=this.cart.items[cartProductIndex].qty+1;
             updatedCartItems[cartProductIndex].qty=newQuantity;
           }
           else
           {
             updatedCartItems.push({productId: product._id,qty:newQuantity});
           }
         const updatedCart={items:updatedCartItems};
         console.log(updatedCart);
         this.cart=updatedCart;
         return this.save();
  
}

 userSchema.methods.removeFromCart=function(productId){
  const updatedCartItems=this.cart.items.filter(i=>i.productId.toString()!==productId.toString());
  this.cart.items=updatedCartItems;
  return this.save();
 }
  
 userSchema.methods.clearCart=function(){
   this.cart={items:[]};
   return this.save();
 }
module.exports=mongoose.model('User',userSchema);

// const mongodb=require('mongodb');
// const getDb=require('../util/database').getDb;

// class User {
//   constructor(username,email,cart,id)
//    {
//        this.username=username;
//        this.email=email;
//        this.cart=cart;
//        this._id=id;
//    }

//    save()
//     {
//        const db=getDb();
//        return db.collection('users').insertOne(this);
//     }

//     addToCart(product){
//        const updatedCartItems=[...this.cart.items];
//        const cartProductIndex=this.cart.items.findIndex(cp=>cp.productId.toString()===product._id.toString());
//        let newQuantity=1;
//        if(cartProductIndex>=0) 
//          {
//            newQuantity=this.cart.items[cartProductIndex].qty+1;
//            updatedCartItems[cartProductIndex].qty=newQuantity;
//          }
//          else
//          {
//            updatedCartItems.push({productId: new mongodb.ObjectID(product._id),qty:newQuantity});
//          }
//        const updatedCart={items:updatedCartItems};
//        const db=getDb();
//        return db.collection('users').
//        updateOne(
//           {_id:new mongodb.ObjectID(this._id)},{$set:{cart:updatedCart}}
//           )
//     }
//      getCart()
//       {
//         const productIds=this.cart.items.map(item=>item.productId);
//         console.log(productIds);
//         const db=getDb();
//         return db.collection('products')
//           .find({_id:{$in:productIds}})
//            .toArray()
//            .then(products=>{
//              console.log(products);
//               return products.map(product=>{
//                 return {
//                   ...product,
//                   qty:this.cart.items.find(i=>i.productId.toString()===product._id.toString()).qty
//                 }
//               })
//            })
//       }

//     deleteItemFromCart(productId){
//         const updatedCartItems=this.cart.items.filter(i=>i.productId.toString()!==productId.toString());
//         const db=getDb();
//         return db.collection('users')
//          .updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:{items:updatedCartItems}}})
//          }
     
//     addOrder(){
//      return this.getCart()
//        .then(products=>{
//         const order={
//           items:products,
//           user:{
//             _id:new mongodb.ObjectID(this._id),
//             username:this.username,
//             email:this.email
//           }
//         }
//         const db=getDb();
//         return db.collection('orders').insertOne(order)
//         })
//         .then(result=>{
//          this.cart={items:[]};
//          const db=getDb();
//          return db.collection('users')
//           .updateOne({_id:new mongodb.ObjectID(this._id)},{$set:{cart:{items:[]}}})
          
//        })
//     }    

//     getOrders(){
//       const db=getDb();
//       console.log(this._id)
//        return db.collection('orders')
//        .find({'user._id':new mongodb.ObjectID(this._id)})
//        .toArray();
//     }
    
//     static findById(userid)
//       {
//        const db=getDb();
//        return db.collection('users').findOne({_id:new mongodb.ObjectID(userid)});
//      }
// }

// module.exports=User;