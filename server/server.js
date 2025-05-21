import dotenv from "dotenv"
dotenv.config()
import express from "express"
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs"
import router from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import plistRouter from "./routes/playlistRoutes.js";

console.log(process.env.MONGO_URI);

const app = express()
const port = process.env.PORT;

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

app.set('view engine','ejs')

app.set('views',path.join(dirName,"../views"))
app.use(express.static(path.join(dirName,"../public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({origin:"http://localhost:3000",credentials:true}))

app.get("/",(req,res)=>{
    res.render("index")
})
app.get("/about",(req,res)=>{
    res.render("about")
})
app.get("/for-the-record",(req,res)=>{
    res.render("forTheRecord")
})
app.get("/developers",(req,res)=>{
    res.render("developers")
})
app.get("/premium-individual-plan",(req,res)=>{
    res.render("premiumIndividual")
})
app.get("/premium-family-plan",(req,res)=>{
    res.render("premiumFamily")
})
app.get("/terms-of-use",(req,res)=>{
    res.render("termsOfUse")
})
app.get("/privacy-policy",(req,res)=>{
    res.render("privacyPolicy")
})
app.get("/songs",(req,res)=>{
    const songsDir = path.join(dirName,"../public","Songs")
    fs.readdir(songsDir,(err,files)=>{
        
        if(err){
           return res.status(500).json({error:"Could not fetch songs"})
        }
        const songFiles = files.map(file=>{
            return `/Songs/${encodeURIComponent(file)}`
        })
        console.log(songFiles);
        res.json(songFiles)

    })
})
app.get("/albums",(req,res)=>{
    const albumsDir = path.join(dirName,"../public","albums")
    fs.readdir(albumsDir,(err,files)=>{
        
        if(err){
           return res.status(500).json({error:"Could not fetch albums"})
        }
        console.log(files);
        
        const albumFiles = files.map(file=>{
            return `/albums/${encodeURIComponent(file)}`
        })
        console.log(albumFiles);
        res.json(albumFiles)

    })
})
app.get("/artists",(req,res)=>{
    const artistsDir = path.join(dirName,"../public","artists")
    fs.readdir(artistsDir,(err,files)=>{
        
        if(err){
           return res.status(500).json({error:"Could not fetch artists"})
        }
        const artistFiles = files.map(file=>{
            return `/artists/${encodeURIComponent(file)}`
        })
        console.log(artistFiles);
        res.json(artistFiles)

    })
})
app.get("/playlists",(req,res)=>{
    const playlistsDir = path.join(dirName,"../public","playlists")
    fs.readdir(playlistsDir,(err,files)=>{
        
        if(err){
           return res.status(500).json({error:"Could not fetch playlists"})
        }
        const playlistFiles = files.map(file=>{
            return `/playlists/${encodeURIComponent(file)}`
        })
        console.log(playlistFiles);
        res.json(playlistFiles)

    })
})
app.get("/get-cards", (req, res) => {
    try{
    const card = "components/card";
    res.render(card);
    }catch(err){
        console.error("Could not render",err);
    }
});
app.get("/playlist-cards",(req,res)=>{
    try{
        const playlistCard = "components/userPlaylistCard"
        res.render(playlistCard)
    }catch(err){
        console.error("Error gettng playlist card",err)
    }
})
app.use("/auth",router)
app.use("/plist",plistRouter)
app.listen(port,()=>{
    console.log("Running server on port 3000.");
    
})