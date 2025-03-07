import mongoose from "mongoose";

const album = new mongoose.Schema({
    name: String,
    artist: String,
    Songs: Array,
    coverImg : String
})