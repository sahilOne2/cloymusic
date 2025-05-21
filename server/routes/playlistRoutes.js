import express from 'express';
const plistRouter = express.Router()
import { Playlist } from '../models/playlist.js'
import connectDb from '../mongodb.js';
connectDb()
import { User } from '../models/userModel.js'
import verifyToken from '../middleware/authMiddleware.js';
plistRouter.post("/create-playlist",verifyToken, async (req, res) => {
    try {
        const { name, desc } = req.body
        
        const user = await User.findOne({ username: req.user.userName })
        const userObjId = user._id
        const playlist = new Playlist({ user: userObjId, name, desc })
        await playlist.save()
        res.status(201).json({ message: "Playlist created successfully." })
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ message: "Error creating playlist", error: err })
    }


})
plistRouter.get("/get-user-playlists", verifyToken, async (req, res) => {
    try{
        const user = await User.findOne({ username: req.user.userName })
        const userObjId = user._id
        const playlists = await Playlist.find({ user: userObjId })
        
        res.status(201).json({message:"Playlists fetched successfully.",playlists:playlists})
    }catch(err){
        console.error(err)
        res.status(500).json({ message: "Error fetching playlists.", error: err })
    }
})
export default plistRouter
