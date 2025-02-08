//Page Initialization:

document.addEventListener('DOMContentLoaded', function() {
        // Removes any previous session data stored in localStorage
    console.log("deleting");
    localStorage.removeItem('cardClicked');
    console.log("deleted");
    
});

const proxy="https://cors-anywhere.herokuapp.com"

/**
 * Fetches the list of song file URLs from the server.
 * @returns {Promise<Array>} - An array of song file URLs.
 */
async function getSongs() {
    let songsFetched =await fetch("/").then
    let response = await songsFetched.text()
    let div = document.createElement('div')
    div.innerHTML=response
    let anchors= div.getElementsByTagName('a')
    let songs=[]
    for (let i=0 ; i<anchors.length ; i++){
        const element= anchors[i]
        if(element.href.endsWith(".mp3")){
            songs.push(element.href)
        }
    }
    return songs
}
/**
 * Fetches artist background images from the server.
 * @returns {Promise<Array>} - An array of artist background image URLs.
 */
async function  getArtistBgs() {
    let bgFeched= await fetch("/artist%20backgrounds/")
    let response = await bgFeched.text()
    let bgdiv=document.createElement('div')
    bgdiv.innerHTML=response
    let bgAnchors=bgdiv.getElementsByTagName('a')
    let aritstBgs=[]
    for (let index = 0; index < bgAnchors.length; index++) {
        const element = bgAnchors[index];
        if(element.href.endsWith(".jpg")){
            aritstBgs.push(element.href)
        }
        
    }
    return aritstBgs
}
/**
 * Fetches album background images from the server.
 * @returns {Promise<Array>} - An array of album background image URLs.
 */
async function getAlbumBgs() {
    let albumBgFetched= await fetch("/album%20backgrounds/")
    let response=await albumBgFetched.text()
    let albumBgDiv=document.createElement('div')
    albumBgDiv.innerHTML=response
    let albumBgAnchors=albumBgDiv.getElementsByTagName('a')
    let albumBgs=[]
    for(let i=0 ; i<albumBgAnchors.length ; i++){
        const element=albumBgAnchors[i]
        if(element.href.endsWith(".jpg")){
            albumBgs.push(element.href)
        }
    }
    return albumBgs
}
/**
 * Fetches playlist background images from the server.
 * @returns {Promise<Array>} - An array of playlist background image URLs.
 */
async function getPlaylistBgs() {
    let playlistBgFetched=await fetch("/Playlists/")
    let response=await playlistBgFetched.text()
    let playlistBgDiv=document.createElement('div')
    playlistBgDiv.innerHTML=response
    console.log(playlistBgDiv);
    let playlistBgAnchors=playlistBgDiv.getElementsByTagName('a')
    
    let playlistBgs=[]
    for (let i = 0; i < playlistBgAnchors.length; i++) {
        const element = playlistBgAnchors[i];
        if(element.href.endsWith(".jpg")){
            playlistBgs.push(element.href)
        }
    }
    return playlistBgs
}

//Main function - initializes the dynamic content.
async function main() {
    let songSources = await getSongs()
    console.log(songSources)

    // Getting the Name of songs with their Artist Names:
    let songList=[]
    for (const song  of songSources) {
        let sliceStart=song.indexOf('s/')
        let sliceEnd=song.indexOf('--')
        let songRawTitle=song.slice(sliceStart+2,sliceEnd)
        let songTitle=songRawTitle.replaceAll("%20"," ")
        songList.push(songTitle)
    }
    console.log(songList);

    //Getting the Name of Artists
    let artistNames=document.querySelectorAll('.artistname')
    let index = 0
    let realArtistNames=[]
    artistNames.forEach(name => {
        let nameSliceIndex=songList[index].indexOf("- ")
        realArtistNames.push(songList[index].slice(nameSliceIndex+2))
        name.innerHTML=realArtistNames[index]
        index+=1
    });
    console.log(realArtistNames);
  
    let bgs= await getArtistBgs()
    console.log(bgs);

    //Setting the name for the artist section cards
    let bgNameList=[]
    for (let i = 0; i < bgs.length; i++) {
        let bgSliceStart=bgs[i].indexOf("s/")
        let bgSliceEnd=bgs[i].indexOf(".j")
        let bgRawTitle=bgs[i].slice(bgSliceStart+2,bgSliceEnd)
        let bgTitle=bgRawTitle.replaceAll("%20"," ")
        bgNameList.push(bgTitle)
    }

    console.log(bgNameList);

    //Setting the background for the aritsts
    let artistbackgrounds=document.querySelectorAll(".artistbg")
    let index2=0
    artistbackgrounds.forEach(bg => {
        let j=0
        for (const bgName of bgNameList) {
            if(bgName==realArtistNames[index2]){
                bg.style.background=`url(${bgs[j]})`
                bg.style.backgroundSize="cover"
                break;
            }
            j++
        }
        index2++;
    })

    let ablumBackgrounds=await getAlbumBgs()
    console.log(ablumBackgrounds);

    //Setting the name of the cards in Album Section
    let albumNames=document.querySelectorAll(".albumname")
    let albumTitles=[]
    for (const name of ablumBackgrounds) {
        let nameSliceStart=name.indexOf('ds/')
        let nameSliceEnd=name.indexOf('.j')
        let rawAlbumTitle=name.slice(nameSliceStart+3,nameSliceEnd)
        let albumTitle=rawAlbumTitle.replaceAll("%20"," ")
        albumTitles.push(albumTitle)
    }
    let index3=0
    albumNames.forEach(element => {
        element.innerHTML=albumTitles[index3].slice(0,albumTitles[index3].indexOf("-"))
        index3++
    });

    //Setting the background image for albums 
    let abBackgrounds=document.querySelectorAll(".albumbg")
    let index4=0
    abBackgrounds.forEach(element => {
        element.style.background=`url(${ablumBackgrounds[index4]})`
        element.style.backgroundSize="cover"
        index4++
    });


    let playlistBackgrounds=await getPlaylistBgs()
    console.log(playlistBackgrounds);

    //Setting the backgrounds of the playlists
    let playlistBackgroundDivs=document.querySelectorAll(".playlistbg")
    let index5=0
    playlistBackgroundDivs.forEach(element => {
        element.style.background=`url(${playlistBackgrounds[index5]})`
        element.style.backgroundSize='cover'
        index5++
    });

    //Setting the name of the cards in the playlist section
    let playlistNames=document.querySelectorAll(".playlistname")
    let index6=0
    for (let i = 0; i < playlistNames.length; i++) {
        const element = playlistNames[i];
        let name=playlistBackgrounds[i]
        let nameSliceStart=name.indexOf('ts/')
        let nameSliceEnd=name.indexOf('.j')
        let rawPlaylistTitle=name.slice(nameSliceStart+3,nameSliceEnd)
        let playlistTitle=rawPlaylistTitle.replaceAll("%20"," ")
        element.innerHTML= playlistTitle
        index6++
    }

    //Common animation for all the buttons in the site
    let allButtons=document.getElementsByTagName("button")
    for (let index = 0; index < allButtons.length; index++) {
        const element = allButtons[index];
        element.addEventListener('click',()=>{
            element.classList.add("buttonClickAnime")
            setTimeout(() => {
                element.classList.remove("buttonClickAnime")
            }, 100);
    
        })
    }

    // Code for dynamically addig all the songs in their related fields
    let queueSongNames=[]
    let nextSongs=[]
    let currentSong=[]
    let audioArray=[]
    let aapWindow=document.querySelector(".aapInfo")
    let musicSection=document.querySelector(".musicSection")
    let playPauseBtn=document.querySelector('.playPause')
    let playPauseSvg=playPauseBtn.querySelector('.playPauseSvg')
    function setPlayerName(nextSong){  //Sets the name of the song currently being played in the player
        for (let index = 0; index < songSources.length; index++) {
            const element = songSources[index];
            if(nextSong===element){
                let playerSongName=document.querySelector(".nameIs")
                playerSongName.innerHTML=songList[index]
            }
        }
    }
    function playSong(queueSongNames,nextSongs,audioArray,currentSong,allCards,playPauseSvg,aapWindow){ //Plays the song when clicked on a song card
        if(queueSongNames.length>0){
            queueSongNames.length=0
        }
        for (let index = 0; index < allCards.length; index++) {
            const cards= allCards[index];
            let trackElement= cards.querySelector(".songSource").innerHTML
            let rawTrackElement=trackElement.replaceAll(" ","%20")
            queueSongNames.push(rawTrackElement)
        }
        for (let index = 0; index < allCards.length; index++) {
            const element = allCards[index];
            console.log(element);
            element.addEventListener("click",()=>{
                if(nextSongs.length>0){
                    nextSongs.length=0
                }
                for (let index = 0; index < queueSongNames.length; index++) {
                    const trackName = queueSongNames[index];
                    for (let index = 0; index < songSources.length; index++) {
                        const trackSource = songSources[index];
                        if(trackSource.includes(trackName)){
                            nextSongs.push(trackSource)
                            break;
                        }
                    }
                }
                console.log(nextSongs);
                let songElement=element.querySelector(".songSource").innerHTML
                let rawSongElement=songElement.replaceAll(" ","%20")
                if(currentSong.length>0){
                    if(!currentSong[0].paused){
                      console.log(currentSong[0].src+"This is current song");           
                      currentSong[0].pause()
                      currentSong.pop()
                      audioArray.length=0
                    }
                    else{
                        currentSong.pop()
                        audioArray.length=0
                    }
                }
                element.classList.add("clickOnSongCard")
                setTimeout(() => {
                    element.classList.remove("clickOnSongCard")
                }, 300);              
                for (let index = 0; index < nextSongs.length; index++) {
                    let songPicked = nextSongs[index];
                    let audio=new Audio(songPicked)
                    audioArray.push(audio)
                }
                for (const audio of audioArray) {
                    console.log(audio.src);
                    
                }
                console.log(audioArray);
                for (let index = 0; index < audioArray.length; index++) {
                    try{
                    let audioToPlay = audioArray[index];
                    if(audioToPlay.src.includes(rawSongElement)){            
                        currentSong.push(audioToPlay)
                        localStorage.setItem('audioUrl',currentSong[0].src)
                        currentSong[0].play()
                        setPlayerName(currentSong[0].src)
                        setMusicIcon(aapWindow)
                        localStorage.setItem("cardClicked",element.querySelector(".songSource").innerHTML)
                        if(!currentSong[0].paused){
                        setInterval(() => {
                            localStorage.setItem('audioVolume',currentSong[0].volume)
                            localStorage.setItem('audioCurrentTime',currentSong[0].currentTime)
                            localStorage.setItem('audioPaused',currentSong[0].paused)
                        }, 100);
                        }           
                        console.log(currentSong[0]+"This is current song");
                        
                        if(playPauseSvg.src.includes('/svgs/plays.svg')){
                            playPauseSvg.src="/svgs/pause.svg"
                        }
                        break;
                    }
                    }catch(error){
                        console.log("error occured in audio assigning",error);
                        
                    }
                }
                   
                
            })
        }
        console.log(queueSongNames);      
    }

    // Function to set the icon of music on the card of song currently being played dynamically
    function setMusicIcon(aapWindow){
        console.log("executing");
        
        let playerName=document.querySelector(".nameIs").innerHTML
        let songInPlayer=playerName.slice(0,playerName.indexOf(" -"))
        if(aapWindow.classList.contains("flex")){
            
            let cardsInWindow=document.querySelectorAll(".card")
                 
            for (let index = 0; index < cardsInWindow.length; index++) {
                const element = cardsInWindow[index];            
                if(element.querySelector(".songSource").innerHTML===songInPlayer){
                    element.querySelector(".currentSongCard").src="/svgs/cardAnime.svg"
                    localStorage.setItem("cardClicked",songInPlayer)            
                }
                else{
                    element.querySelector(".currentSongCard").src=""
                }
            }
        }
        else{
            localStorage.setItem("cardClicked",songInPlayer)
        }
    }

    function openAap(rawName,aapWindow){ //Adds the songs of clicked artst album or playlist in the aapWindow area
        let card=document.createElement("div")
            card.innerHTML=`<div class="card flex row vercenter relative" tabindex="0">
                                <div class="gap flex row vercenter">
                                <div class="songLogo"><img src="/pngs/icon.png" alt="" class="songLogoImage"></div>
                                <div class="songName"><p class="songSource">Song Name</p></div>
                                </div>
                                <div class="threeDots"><img src="" class="currentSongCard relative"><button class="songCardMenu noBackground radius"><img src="/svgs/three dots.svg" alt="" class="threeDotsSvg"></button>
                            </div>`
            console.log(card);
            for (let index = 0; index < songSources.length; index++) {
                const element = songSources[index];
                if(element.includes(rawName)){
                    let insertedCard=card.querySelector(".card")
                    insertedCard.querySelector(".songSource").innerHTML= `${songList[index].slice(0,songList[index].indexOf(" -"))}`
                    aapWindow.querySelector(".songsList").insertAdjacentHTML('beforeend',insertedCard.outerHTML)
                    console.log(insertedCard);          
                }
            }
            let currentCards=document.querySelectorAll(".card")
            console.log(currentCards);
            if(localStorage.getItem("cardClicked")!=null){
            console.log("working on it");  
              for (let index = 0; index < currentCards.length; index++) {
                const element = currentCards[index];
                if(localStorage.getItem("cardClicked")==element.querySelector(".songSource").innerHTML){
                    console.log("job done");                   
                    element.querySelector(".currentSongCard").src="/svgs/cardAnime.svg"
                }
              }
            }
    }
    
    //Opens the aapWindow for the clicked artist, album or playlist:
    let artists=document.querySelectorAll(".artist")
    for (let index = 0; index < artists.length; index++) {
        const element = artists[index];
        element.addEventListener("click",(e)=>{
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfArtist=element.querySelector(".artistname").innerHTML
            let rawNameOfArtist=nameOfArtist.replaceAll(" ","%20")
            console.log(nameOfArtist)
            for (let index = 0; index < bgs.length; index++) {
                const source = bgs[index];
                if(source.includes(rawNameOfArtist)){
                    aapWindow.querySelector(".aapImage").src=`${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML=nameOfArtist
                    break;
                }
            }
            openAap(rawNameOfArtist,aapWindow)
            let allCards=document.querySelectorAll(".card")
            console.log(allCards);        
            playSong(queueSongNames,nextSongs,audioArray,currentSong,allCards,playPauseSvg,aapWindow)         
        })
    }
    let ablums=document.querySelectorAll(".album")
    for (let index = 0; index < ablums.length; index++) {
        const element = ablums[index];
        element.addEventListener("click",(e)=>{
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfAlbum=element.querySelector(".albumname").innerHTML
            let rawNameOfAlbum=nameOfAlbum.replaceAll(" ","%20")
            console.log(nameOfAlbum)
            for (let index = 0; index < ablumBackgrounds.length; index++) {
                const source = ablumBackgrounds[index];
                if(source.includes(rawNameOfAlbum)){
                    aapWindow.querySelector(".aapImage").src=`${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML=nameOfAlbum
                    break;
                }
            }
            openAap(rawNameOfAlbum,aapWindow)
            let allCards=document.querySelectorAll(".card")
            console.log(allCards);         
            playSong(queueSongNames,nextSongs,audioArray,currentSong,allCards,playPauseSvg,aapWindow)              
        })
    }
    let playlists=document.querySelectorAll(".playlist")
    for (let index = 0; index < playlists.length; index++) {
        const element = playlists[index];
        element.addEventListener("click",(e)=>{
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfPlaylist=element.querySelector(".playlistname").innerHTML
            let rawNameOfPlaylist=nameOfPlaylist.replaceAll(" ","%20")
            console.log(nameOfPlaylist)
            for (let index = 0; index < playlistBackgrounds.length; index++) {
                const source = playlistBackgrounds[index];
                if(source.includes(rawNameOfPlaylist)){
                    aapWindow.querySelector(".aapImage").src=`${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML=nameOfPlaylist
                    break;
                }
            }

            //Saperately creating the code of openAap function for the playlists due to naming complexities: 
            let card=document.createElement("div")
            card.innerHTML=`<div class="card flex row vercenter relative" tabindex="0">
                                <div class="gap flex row vercenter">
                                <div class="songLogo"><img src="/pngs/icon.png" alt="" class="songLogoImage"></div>
                                <div class="songName"><p class="songSource">Song Name</p></div>
                                </div>
                                <div class="threeDots flex row horcenter vercenter"><img src="" class="currentSongCard relative"><button class="songCardMenu noBackground radius"><img src="/svgs/three dots.svg" alt="" class="threeDotsSvg"></button>
                            </div>`
            console.log(card);
            const substrings=new Set()
            let hasIt=false
            for (let index = 0; index < songSources.length; index++) {
                const element = songSources[index];
                const realName=element.replaceAll("%20"," ")
                let minLength=6
                for (let length = minLength; length <= nameOfPlaylist.length; length++) {
                    for (let i = 0; i <= nameOfPlaylist.length-length; i++) {
                        const substring=nameOfPlaylist.substring(i,i+minLength)
                        substrings.add(substring)
                    }
                }
                for (let length = minLength; length <= realName.length; length++) {
                    for (let i = 0; i <= realName.length-length; i++) {
                        const substring1=realName.substring(i,i+minLength)
                        if(substrings.has(substring1)){
                          let insertedCard=card.querySelector(".card")
                          insertedCard.querySelector(".songSource").innerHTML= `${songList[index].slice(0,songList[index].indexOf(" -"))}`
                          aapWindow.querySelector(".songsList").insertAdjacentHTML('beforeend',insertedCard.outerHTML)
                          console.log(insertedCard);
                          hasIt=true
                          break;
                        }
                    }
                    if(hasIt){
                        break;
                    }
                }
                let currentCards=document.querySelectorAll(".card")
                console.log(currentCards);
                if(localStorage.getItem("cardClicked")!=null){
                console.log("working on it");        
                for (let index = 0; index < currentCards.length; index++) {
                  const element = currentCards[index];
                  if(localStorage.getItem("cardClicked")==element.querySelector(".songSource").innerHTML){              
                      element.querySelector(".currentSongCard").src="/svgs/cardAnime.svg"
                  }
                }
              }
            }
            let allCards=document.querySelectorAll(".card")
            console.log(allCards);        
            playSong(queueSongNames,nextSongs,audioArray,currentSong,allCards,playPauseSvg,aapWindow)
        })
    }

    //Event listener  to play or pause the current song:
    playPauseBtn.addEventListener('click',()=>{
        if(playPauseSvg.src.includes("/svgs/plays.svg")){
            if(currentSong.length>0){
              playPauseSvg.src="/svgs/pause.svg"
              currentSong[0].play()
            }       
        }
        else if(playPauseSvg.src.includes("/svgs/pause.svg")){
            playPauseSvg.src="/svgs/plays.svg"
            currentSong[0].pause()
        }
    })

    //Setting the current time of the song every Second in the player
    let currentTimeElement=document.querySelector(".currentTime")
    let durationElement=document.querySelector(".durationTime")
    let seekBall=document.querySelector(".seekBall")
    let seekBar=document.querySelector(".seekBar")
    function secondsToMinutes(currentTime,duration){
        let seconds,minutes
        if(currentTime<60){
            if(currentTime<10){
                currentTimeElement.innerHTML="00:0"+currentTime     
            }
            else{
                currentTimeElement.innerHTML="00:"+currentTime
            }
        }
        else{
            minutes=Math.floor(currentTime/60)
            seconds=Math.floor(currentTime-minutes*60)
            if(minutes<10){
                if(seconds<10){
                  currentTimeElement.innerHTML="0"+minutes+":0"+seconds
                }
                else{
                    currentTimeElement.innerHTML="0"+minutes+":"+seconds
                }
            }
            else{
                if(seconds<10){
                    currentTimeElement.innerHTML=minutes+":0"+seconds
                  }
                  else{
                      currentTimeElement.innerHTML=minutes+":"+seconds
                  }
            }
        }
        seekBall.style.left=(currentTime/duration)*100+"%"
        let durationMinutes=Math.floor(duration/60)
        let durationSeconds=Math.floor(duration-durationMinutes*60)
        if(durationMinutes<10){
            if(durationSeconds<10){
                durationElement.innerHTML="0"+durationMinutes+":0"+durationSeconds
            }
            else{
                durationElement.innerHTML="0"+durationMinutes+":"+durationSeconds
            }
        }
        else{
            if(durationSeconds<10){
                durationElement.innerHTML=durationMinutes+":0"+durationSeconds
            }
            else{
                durationElement.innerHTML=durationMinutes+":"+durationSeconds
            }
        }
    }
    
    function playNext(currentSong, audioArray,playPauseSvg,aapWindow) {//Function to play the next song when a song has ended
        if (!currentSong || currentSong.length === 0) {
            return;
        }
    
        const audio = currentSong[0]; // Assuming currentSong[0] is the active audio element
    
        // Attaching the `ended` event listener once
        if (!audio.hasEventListener) { // Custom flag to avoid re-adding the listener
            audio.addEventListener("timeupdate",()=>{
                secondsToMinutes(Math.floor(audio.currentTime),Math.floor(audio.duration))
            })
            seekBar.addEventListener('click',e=>{
                leftInPer=(e.offsetX/e.target.getBoundingClientRect().width)*100
                seekBall.style.left=leftInPer+"%"
                let audio=currentSong[0]
                audio.currentTime=(leftInPer*audio.duration)/100
            })
            audio.addEventListener("ended", () => {
                console.log("Song ended.");
                // Finding the index of the current song in the audioArray
                const currentIndex = audioArray.findIndex(element => element.src === audio.src);
    
                if (currentIndex >= 0 && currentIndex < audioArray.length - 1) {
                    // Moving to the next song
                    const nextAudio = audioArray[currentIndex + 1];
                    currentSong[0].currentTime=0
                    currentSong.pop(); // Removed the old audio
                    currentSong.push(nextAudio); // Added the new audio
                    console.log(nextAudio);
                    setPlayerName(nextAudio.src)
                    nextAudio.play();
                    setMusicIcon(aapWindow)
                    console.log(`Now playing: ${nextAudio.src}`);
                } else {
                    console.log("End of playlist.");
                    playPauseSvg.src="/svgs/plays.svg"
                    currentSong[0].currentTime=0
                }
            });
    
            // Marked listener as added
            audio.hasEventListener = true;
        }
    }
    setInterval(() => {
        playNext(currentSong, audioArray, playPauseSvg,aapWindow);
    }, 1000);

    //Temporary solution for the features which are currently unavailable
    let anchors=document.getElementsByTagName("a")
    for (let index = 0; index < anchors.length; index++) {
        const element = anchors[index];
        element.addEventListener("click",e=>{
            e.preventDefault()
            alert("This feature will be available soon")
        })
    }
    let formButtons=document.querySelector(".searchbar").getElementsByTagName("button")
    for (let index = 0; index < formButtons.length; index++) {
        const element = formButtons[index];
        element.addEventListener("click",e=>{
            e.preventDefault()
            alert("The feature will be available soon")
        })
    }
    let logSignButtons=document.querySelector(".logsign").getElementsByTagName("button")
    let libraryButtons=document.querySelector(".library").querySelectorAll(".noFunction")
    let logLabBtn=[...logSignButtons,...libraryButtons]
    for (let index = 0; index < logLabBtn.length; index++) {
        const element = logLabBtn[index];
        element.addEventListener("click",e=>{
            e.preventDefault()
            alert("This feature will be available soon")
        })
    }

    //Event listeners to play previous and next song when the respective button is clicked
    let prev=document.querySelector(".previous")
    let next=document.querySelector(".next")
    prev.addEventListener("click",()=>{
        if(currentSong[0].src==audioArray[0].src){
            currentSong[0].pause()
            currentSong[0].currentTime=0
            setPlayerName(currentSong[0].src)
            currentSong[0].play()
            setMusicIcon(aapWindow)
        }
        else{
        for (let index = 0; index < audioArray.length; index++) {
            const element = audioArray[index];
            if(element.src==currentSong[0].src){
                currentSong[0].pause()
                currentSong[0].currentTime=0
                currentSong.pop()
                currentSong.push(audioArray[index-1])
                setPlayerName(currentSong[0].src)
                currentSong[0].play()
                setMusicIcon(aapWindow)
                break;
            }
        }
        }
    })
    next.addEventListener("click",()=>{
        if(currentSong[0].src==audioArray[(audioArray.length)-1].src){
            currentSong[0].pause()
            currentSong[0].currentTime=0
            currentSong[0]=audioArray[0]
            currentSong[0].play()
            setPlayerName(currentSong[0].src)
            setMusicIcon(aapWindow)
        }
        else{
        for (let index = 0; index < audioArray.length; index++) {
            const element = audioArray[index];
            if(element.src==currentSong[0].src){
                currentSong[0].pause()
                currentSong[0].currentTime=0
                currentSong.pop()
                currentSong.push(audioArray[index+1])
                currentSong[0].play()
               
                setPlayerName(currentSong[0].src)
                setMusicIcon(aapWindow)
                break;
            }
        }
        }
    })

    //Event listener to close the aapWindow whent the close(back) button is hit
    let backButton=document.querySelector(".closeAap")
    backButton.addEventListener("click",(e)=>{
        e.preventDefault()
        let cardsInWindow=document.querySelectorAll(".card")
        console.log(cardsInWindow);
        
        for (let index = 0; index < cardsInWindow.length; index++) {
            const element = cardsInWindow[index];
            if(element.querySelector(".currentSongCard").src=="/svgs/cardAnime.svg"){
                localStorage.setItem("cardClicked",element.querySelector("songSource").innerHTML)
                break;
            }
        }
        aapWindow.classList.remove('flex')
        aapWindow.classList.remove('opaque')
        musicSection.classList.remove('noOverflow')
        aapWindow.querySelector(".songsList").innerHTML=""
        
    })

    //Code to maintain the responsiveness of the site by hiding or showing the library according to the media queries
    let library=document.querySelector(".library")
    let menuBtn=document.querySelector(".menu")
    let libsvg=document.querySelector(".libsvg")
    menuBtn.addEventListener('click',()=>{   
         console.log(library);  
         library.style.left="0px"
         libsvg.src="/svgs/Back.svg"
         libsvg.style.filter="invert(0)"
         libsvg.style.height="2vh"
    })
    const mediaQuery=window.matchMedia("(max-width:1200px)")
    const mediaQuery1=window.matchMedia("(min-width:1201px)")
    
    setInterval(() => {   
       if (mediaQuery1.matches){
           library.style.left="unset"
       }
    }, 500);
    let libCloseBtn=document.querySelector(".librarybutton")
    libCloseBtn.addEventListener("click",()=>{
        if(mediaQuery.matches){
        library.style.left="-280px"
        libsvg.src="/svgs/library.svg"
        }
    })
    
    
}

main()//main function call


document.addEventListener('contextmenu', function (event) {//Event listener to hide the context menu 
    event.preventDefault();
});

//Code the make the right and left scrolling butttons functional
const scrollLeftBtn=document.querySelectorAll('.scrollLeft')
const scrollRightBtn=document.querySelectorAll('.scrollRight')
const scroll=190
scrollLeftBtn.forEach(btn => {
    btn.addEventListener('click',(e)=>{
        e.preventDefault()
        const scrolledDivLeft=btn.nextElementSibling
        scrolledDivLeft.scrollTo({
            top: 0,
            left: scrolledDivLeft.scrollLeft-scroll,
            brhaviour: 'smooth'
        })
    })
    
});
scrollRightBtn.forEach(btn => {
    btn.addEventListener('click',(e)=>{
        e.preventDefault()
        const scrolledDivRight=btn.previousElementSibling
        scrolledDivRight.scrollTo({
            top: 0,
            left: scrolledDivRight.scrollLeft+scroll,
            brhaviour: 'smooth'
        })
    })
});

//Function to detect if the device opening the site is touchscreen or not to hide the scrolling buttons respective to the device
function isTouchScreen(){
    return window.matchMedia("(pointer:coarse)").matches
}
if(isTouchScreen()){
    document.querySelector(".scrollLeft").classList.add('noDisplay')
    document.querySelector(".scrollRight").classList.add('noDisplay')
}

//Code to add the animation on the play button when we hover on it
const hoverElement=document.querySelectorAll('.hover')
hoverElement.forEach(elem=>{
    elem.addEventListener('mouseover', (e)=>{
        e.preventDefault()
        const playbtnHover=elem.querySelector('.plays')
        playbtnHover.classList.add('visible')
    })
    elem.addEventListener('mouseout',(e)=>{
        e.preventDefault()
        const playbtnHover=elem.querySelector('.plays')
        playbtnHover.classList.remove('visible')
    })
})
