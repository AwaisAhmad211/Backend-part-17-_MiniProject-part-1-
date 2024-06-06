const express = require('express') ;
const path = require('path');
const app = express();
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const { hash } = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


app.set("view engine" , "ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true})) ;
app.use(express.static(path.join(__dirname,"public")))
app.use(cookieParser());

app.get("/profile",isLoggedIn ,(req,res)=>{
res.send(req.user);
})
app.get("/",(req,res)=>{
    res.render("index");
})
app.post("/create",(req,res)=>{
let {name,email,password,age} = req.body ;
bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password,salt, async (err,hash)=>{
        let user =await userModel.create({
            name,
            email,
            password : hash ,
            age,
        })
        console.log(user)
        let token =  jwt.sign(email,"secret")
        res.cookie("token",token);
        res.send("Done")
    })
})   
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/logout",(req,res)=>{
    res.cookie("token","") ;
    res.redirect("/login");
})
app.post("/login",async (req,res)=>{
    let {email,password} = req.body ;
    console.log(req.cookies.token);
    let user = await userModel.findOne({email});
    if(!user) return res.send("Something went wrong");
    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(!result) return res.send("Something went wrong")
            else{
               let token = jwt.sign(user.email,"secret")
               res.cookie("token",token);
               res.send("Working");
            }     
        });
    }
})
function isLoggedIn(req,res,next){
  if(req.cookies.token === "") res.send("You have to login first")
    else{
      let data = jwt.verify(req.cookies.token,"secret")
      req.user = data
      next();
    }
}
app.listen(3000)