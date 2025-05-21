
export function searchLogic(songSources, API_URL , queueSongNames , nextSongs , audioArray, currentSong, songList, playPauseSvg, setPlayerName,musicSection) { //Searches the song when typed in the search bar and plays it when clicked on it.
    
    
    const searchResultsDiv = document.querySelector(".searchResultsDiv")
    const searchInput = document.querySelector(".searchInput")
    searchInput.addEventListener("input", async (e) => {
        e.preventDefault()
        // if(searchInput.value<3){
        //     return
        // }
        searchResultsDiv.innerHTML = ""
        searchResultsDiv.classList.remove("noDisplay")
        for (const song of songSources) {
            const songTitle = decodeURIComponent(song.toLowerCase())
            const searchValue = searchInput.value.toLowerCase()
            if (songTitle.includes(searchValue)) {
                let card = document.createElement("div")
                const response = await fetch(`${API_URL}/get-cards`)
                const result = await response.text()
                card.innerHTML = result
                const resultCard = card.querySelector(".card")
                resultCard.querySelector(".songSource").innerHTML = `${songTitle.slice(songTitle.indexOf("s/") + 2, songTitle.indexOf(" ["))}`
                console.log(resultCard);
                searchResultsDiv.insertAdjacentElement("beforeend", resultCard)
            }
        }
        const searchResultCards = searchResultsDiv.querySelectorAll(".card")
        searchResultCards.forEach(element => {
            element.addEventListener("click", () => {
                if(queueSongNames.length >0){
                    queueSongNames.length = 0
                }
                if(nextSongs.length>0){
                    nextSongs.length = 0
                }
                if(audioArray.length > 0) {
                    audioArray.length = 0
                }
                for (let index = 0; index < searchResultCards.length; index++) {
                    const resultedCard= searchResultCards[index];
                    if(resultedCard.querySelector(".currentSongCard").src.includes("svgs/cardAnime.svg")){
                        resultedCard.querySelector(".currentSongCard").src  = ""
                    }
                }
                let songElement = element.querySelector(".songSource").innerHTML
                let rawSongElement = encodeURIComponent(songElement)
                console.log(rawSongElement);
                
                if (currentSong.length > 0) {
                    if (!currentSong[0].paused) {
                        console.log(currentSong[0].src + "This is current song");
                        currentSong[0].pause()
                        currentSong.pop()
                    }
                    else {
                        currentSong.pop()
                    }
                }
                let audioToPlay;
                element.classList.add("clickOnSongCard")
                setTimeout(() => {
                    element.classList.remove("clickOnSongCard")
                }, 300);
                for (let index = 0; index < songSources.length; index++) {
                    const comparedSrc = songSources[index].toLowerCase()
                    if (comparedSrc.includes(rawSongElement)){
                        audioToPlay = new Audio(songSources[index])
                        break;
                    }
                }
                currentSong.push(audioToPlay)
                console.log(currentSong[0]);
                
                localStorage.setItem('audioUrl', currentSong[0].src)
                currentSong[0].play()
                setPlayerName(currentSong[0].src, songSources, songList)
                element.querySelector(".currentSongCard").src = "svgs/cardAnime.svg"
                localStorage.setItem("cardClicked", element.querySelector(".songSource").innerHTML)
                
                if (playPauseSvg.src.includes('/svgs/plays.svg')) {
                    playPauseSvg.src = "/svgs/pause.svg"
                }
            })
        });
    
    })
    musicSection.addEventListener("click", (e) => {
        
        const searchInput = document.querySelector(".searchInput")
        if (!searchResultsDiv.classList.contains("noDisplay")){
            e.preventDefault()
            searchResultsDiv.innerHTML = ""
            searchResultsDiv.classList.add("noDisplay")
            searchInput.value = ""
            searchInput.blur()
        }
    })
}