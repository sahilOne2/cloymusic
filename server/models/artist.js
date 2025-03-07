import mongoose from "mongoose";

const artist = new mongoose.Schema({
    name: String,
    genre: Array,
    coverImg: String,
    songs: Array,
})

export const Aritst = mongoose.model('Artist',artist)