import mongoose from "mongoose";

const playlist = new mongoose.Schema({
    user: {type:mongoose.Schema.Types.ObjectId,
        ref: 'User',required:true},
    name: {type:String,required:true},
    desc: {type:String,required:true},
    songs: Array
})

export const Playlist = mongoose.model('Playlist',playlist) 