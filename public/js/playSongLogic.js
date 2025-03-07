export function playSong(queueSongNames, nextSongs, audioArray, currentSong, allCards, playPauseSvg, aapWindow, songSources, songList,loggedIn,setMusicIcon,setPlayerName) { //Plays the song when clicked on a song card
 
    if (queueSongNames.length > 0) {
        queueSongNames.length = 0
    }
    for (let index = 0; index < allCards.length; index++) {
        const cards = allCards[index];
        let trackElement = cards.querySelector(".songSource").innerHTML
        let rawTrackElement = trackElement.replaceAll(" ", "%20")
        queueSongNames.push(rawTrackElement)
    }
    for (let index = 0; index < allCards.length; index++) {
        const element = allCards[index];
        console.log(element);
        element.addEventListener("click", () => {
            if(!loggedIn){
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
            let rawSongElement = songElement.replaceAll(" ", "%20")
            if (currentSong.length > 0) {
                if (!currentSong[0].paused) {
                    console.log(currentSong[0].src + "This is current song");
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
            for (const audio of audioArray) {
                console.log(audio.src);

            }
            console.log(audioArray);
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
                        if (!currentSong[0].paused) {
                            setInterval(() => {
                                localStorage.setItem('audioVolume', currentSong[0].volume)
                                localStorage.setItem('audioCurrentTime', currentSong[0].currentTime)
                                localStorage.setItem('audioPaused', currentSong[0].paused)
                            }, 100);
                        }
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