const { name } = require('ejs');
const mongoose = require('mongoose') ;
mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema = mongoose.Schema({
    name : String ,
    email : String ,
    age : Number ,
    password : String,
    posts : Array,
})

module.exports = mongoose.model("user",userSchema)