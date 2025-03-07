import mongoose, { mongo } from "mongoose";

const song = new mongoose.Schema({
    title: String,
    artist: String,
    album: String,
    cover: String,
    filePath: String,
    genre: {type:[String],default:[]}
})
export const Song = mongoose.model('Song',song)