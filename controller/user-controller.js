const User = require('../modal/user')
const bcrypt = require("bcrypt");
const jwt =require("jsonwebtoken");
const JWT_SECRET="Alibaba"


const signup = async (req, res, next) => {
    const { name, email, password } = req.body
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });

    } catch (err) {
        console.log(err);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }


    const hashedPassword = bcrypt.hashSync(password, 10)

    const user = new User({
        name,//name:name
        email,
        password: hashedPassword
    });

    try {
        await user.save();
    } catch (err) {
        console.log(err);
    }

    return res.status(201).json({ message: user })
}

const login =async(req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;
    try{
        existingUser=await User.findOne({email:email})

    }catch(err){
        return new Error(err)
    }
    if(!existingUser){
        return res.status(400).json({message:"User not found.Signup Please..."})
    }
    const isPasswordCorrect =bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Inavalid Email / Password"})
    }

    const token =jwt.sign({id:existingUser._id},JWT_SECRET,{expiresIn:"30s"})
    // add cookies
    res.cookie(String(existingUser._id),token,{
        path:"/",
        expires:new Date(Date.now()+1000*30),
        httpOnly:true,
        sameSite:"lax"
    })

    return res.status(200).json({
        message:"Successfully logged In",user:existingUser,token
    })


}

const verifyToken =(req,res,next)=>{
    const cookies=req.headers.cookie;
    const token =cookies.split("=")[1];
    console.log("tokon",token); 
    console.log(cookies);
//     const headers =req.headers[`authorization`];
//     const token =headers.split(' ')[1];
    if(!token) {
        res.status(404).json({message:"No token found"})
    }
    jwt.verify(String(token),JWT_SECRET,(err,user)=>{
        if(err){
          return  res.status(400).json({
                message :"Invalid Token"
            });
        }
       
        console.log(user.id)
        req.id=user.id;
    });

   next();
};

// const getUser = async (req,res,next)=>{
//     const userId =req.id ;
//     let user;
//     try{
//         user=await User.findOne(userId,"-password");
//     }catch(err){
//         return new Error(err)
//     }
//     if(!user){
//         return res.status(404).json({message:"user Not found"});

//     }
//     return res.status(200).json({
//         user
//     })
// }
const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
      user = await User.findById(userId, "-password");
    } catch (err) {
      return new Error(err);
    }
    if (!user) {
      return res.status(404).json({ messsage: "User Not FOund" });
    }
    return res.status(200).json({ user });
  };





exports.signup = signup;
exports.login=login;
exports.verifyToken=verifyToken;
exports.getUser=getUser;