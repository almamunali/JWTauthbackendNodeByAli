const express=require('express');
const mongoose =require("mongoose");

const app=express();
mongoose.connect('mongodb+srv://admin:alibaba@cluster0.90evzxw.mongodb.net/auth?retryWrites=true&w=majority').then(()=>{
    app.listen(5000);
    console.log("Database is connected Listening to localhost:5000")
}).catch((err)=>console.log(err));

