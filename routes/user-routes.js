const express =require("express");
const {signup} =require('../controller/user-controller')

const router=express.Router();
router.post('/signup',signup);

router.get("/",(req,res,next)=>{
    res.send("Hello World")
});

module.exports=router