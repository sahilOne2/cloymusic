import mongoose from "mongoose";

const user = new mongoose.Schema({
    fullname: {type:String,required:true},
    username: {type:String,unique:true,required:true},
    email:{type:String,unique:true,required:true},
    password: {type:String,required:true},
    preferances: {type:Array},
    playlists: {type:Array}
})

export const User = mongoose.model('User',user);