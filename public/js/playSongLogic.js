export function playSong(queueSongNames, nextSongs, audioArray, currentSong, allCards, playPauseSvg, aapWindow, songSources, songList,loggedIn,setMusicIcon,setPlayerName) { //Plays the song when clicked on a song card
 
    if (queueSongNames.length > 0) {
        queueSongNames.length = 0
    }
    for (let index = 0; index < allCards.length; index++) {
        const cards = allCards[index];
        let trackElement = cards.querySelector(".songSource").innerHTML
        let rawTrackElement = encodeURIComponent(trackElement)
        queueSongNames.push(rawTrackElement)
    }

    // Finds out the song which was clicked and then plays it and handles its execution.
    for (let index = 0; index < allCards.length; index++) {
        const element = allCards[index];
        console.log(element);
        element.addEventListener("click", () => {
            if(!loggedIn.value){
                alert("Login First.")
                return;
            } 
            if (nextSongs.length > 0) {
                nextSongs.length = 0
            }
            console.log("clicked");
            
            for (let index = 0; index < queueSongNames.length; index++) {
                const trackName = queueSongNames[index];
                for (let index = 0; index < songSources.length; index++) {
                    const trackSource = songSources[index];
                    if (trackSource.includes(trackName)) {
                        nextSongs.push(trackSource)
                        break;
                    }
                }
            }
            console.log(nextSongs);
            let songElement = element.querySelector(".songSource").innerHTML
            let rawSongElement = encodeURIComponent(songElement)
            if (currentSong.length > 0) {
                if (!currentSong[0].paused) {
                    currentSong[0].pause()
                    currentSong.pop()
                    audioArray.length = 0
                }
                else {
                    currentSong.pop()
                    audioArray.length = 0
                }
            }
            element.classList.add("clickOnSongCard")
            setTimeout(() => {
                element.classList.remove("clickOnSongCard")
            }, 300);
            for (let index = 0; index < nextSongs.length; index++) {
                let songPicked = nextSongs[index];
                let audio = new Audio(songPicked)
                audioArray.push(audio)
            }
            for (let index = 0; index < audioArray.length; index++) {
                try {
                    let audioToPlay = audioArray[index];
                    if (audioToPlay.src.includes(rawSongElement)) {
                        currentSong.push(audioToPlay)
                        localStorage.setItem('audioUrl', currentSong[0].src)
                        currentSong[0].play()
                        setPlayerName(currentSong[0].src, songSources, songList)
                        setMusicIcon(aapWindow)
                        localStorage.setItem("cardClicked", element.querySelector(".songSource").innerHTML)
                        
                        console.log(currentSong[0] + "This is current song");

                        if (playPauseSvg.src.includes('/svgs/plays.svg')) {
                            playPauseSvg.src = "/svgs/pause.svg"
                        }
                        break;
                    }
                } catch (error) {
                    console.log("error occured in audio assigning", error);
                }
            }

        })
    }
    console.log(queueSongNames);
}