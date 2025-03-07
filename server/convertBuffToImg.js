import path from "path"
import sharp from "sharp"

const getPicture = (imgBuffer,songPath)=>{
   try{ 
    if(imgBuffer){
       const imagePath = path.join(path.dirname(songPath),"coverImgs",path.basename(songPath,path.extname(songPath))+".webp")
       sharp(imgBuffer.data)
          .toFormat("webp")
          .toFile(imagePath)
       console.log("added cover successfully");
       return imagePath  
    }
    else{
        console.log("No Image found.");
        return null
    }
  }catch(error){
    console.log("Error Extracting image",error);
    return null
  }
}

export default getPicture;

