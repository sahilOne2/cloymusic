import express from "express"
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs"

const app = express()
const port = 3000;
const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

app.set('view engine','ejs')
app.use(express.static(path.join(dirName,"public")))

console.log(dirname);

app.get("/",(req,res)=>{
    setTimeout(() => {
        app.get("/Songs")
    }, 1000);
    res.render("index")
})

app.get("/Songs",(req,res)=>{
    const songsDir = path.join(dirName,"public","Songs")
    fs.readdirSync(songsDir,(err,files)=>{
        return res.status(500).json({error:"Could not fetch songs"})
    })

    const songFiles = files.map(file=>{
        path = `/Songs/${file}`
    })
    
    res.json(songFiles)
})

app.listen(port,()=>{
    console.log("Running server on port 3000.");
    
})