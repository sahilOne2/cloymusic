import mongoose from "mongoose";

const playlist = new mongoose.Schema({
    name: String,
    genre: String,
    songs: Array
})

export const Playlist = mongoose.model('Playlist',playlist) 