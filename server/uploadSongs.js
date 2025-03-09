import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
import mm from "music-metadata"
import fs, { readdirSync} from "fs";
import path from "path";
import {Song} from "./models/songModel.js"
import connectDb from "./mongodb.js";
import { fileURLToPath } from "url";
import axios from "axios";

connectDb()
const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)
const fetchAdditionalDataFromDeezer = async (artist, title) => {
    try {
        
        console.log("running.");
        
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(title)}`;
        const response = await axios.get(url);

        if (!response.data.data || response.data.data.length === 0) {
            console.log(`⚠️ No Deezer data found for: ${title} by ${artist}`);
            return { genre: "Unknown Genre", cover: null };
        }

        const track = response.data.data[0];

        return {
            genre: track.genre_id || "Unknown Genre",
            cover: track.album.cover_big || null, // Fetch large album cover image
        };
    } catch (err) {
        console.error(`❌ Deezer error for ${title} by ${artist}:`, err.message);
        return { genre: "Unknown Genre", cover: null };
    }
};
const uploadSongs = async ()=>{
    const songs = fs.readdirSync(path.join(dirName,"../public","Songs"))
    
    for (const songName of songs){
        const songPath = path.join(dirName,"../public","Songs",songName)
        const trackName = decodeURIComponent(path.basename(songPath, '.mp3'));
        const params = new URLSearchParams({
            query: `recording:"${trackName}"`,
            fmt: 'json'
          });
        const url = `https://musicbrainz.org/ws/2/recording/?${params.toString()}`;    
        const response = await axios.get(url,{
            headers: { 'User-Agent': 'cloymusic/1.0 (gautamsahil8376@gmail.com)' }
        });
        
        if (!response.data.recordings || response.data.recordings.length === 0) {
            console.log(`⚠️ No metadata found for: ${trackName}`);
            continue; // Skip this song
        }
        const metadata = response.data.recordings ? response.data.recordings[0]:null
        
        const deezerData = await fetchAdditionalDataFromDeezer(metadata['artist-credit'][0].name,metadata.title)
        console.log(metadata);
        const song = new Song({
            artist:metadata['artist-credit'][0].name,
            title :metadata.title,
            album :metadata.releases ? metadata.releases[0].title : 'Unknown Album',
            cover:deezerData.cover,
            genres:deezerData.genre
        })
        console.log(song);
        
        await song.save()
    };
}
uploadSongs()