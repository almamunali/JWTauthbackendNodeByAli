const express =require("express");
const {signup,login, verifyToken, getUser} =require('../controller/user-controller')

const router=express.Router();
router.post('/signup',signup);
router.post('/login',login);
router.get("/user",verifyToken,getUser)


router.get("/",(req,res,next)=>{
    res.send("Hello World")
});

module.exports=router