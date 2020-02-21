const express=require('express');
const router=express.Router();

router.get('/',(req,res,next)=>{
    res.send('You are connected on the server');
})

module.exports=router;