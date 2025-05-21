export const artistsMangaement = (artistBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, openAap) => {
    let artists = document.querySelectorAll(".artist")
    for (let index = 0; index < artists.length; index++) {
        const element = artists[index];
        element.addEventListener("click", async (e) => {
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfArtist = element.querySelector(".artistname").innerHTML
            let rawNameOfArtist = nameOfArtist.replaceAll(" ", "%20")
            console.log(nameOfArtist)
            for (let index = 0; index < artistBgs.length; index++) {
                const source = artistBgs[index];
                if (source.includes(rawNameOfArtist)) {
                    aapWindow.querySelector(".aapImage").src = `${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML = nameOfArtist
                    break;
                }
            }
            await openAap(rawNameOfArtist, aapWindow, songSources, songList)
            let allCards = document.querySelectorAll(".card")
            console.log("All Cards:", allCards);
            playSong(queueSongNames, nextSongs, audioArray, currentSong, allCards, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName)
        })
    }
}
export const albumManagement = (albumBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, openAap) => {
    let ablums = document.querySelectorAll(".album")
    for (let index = 0; index < ablums.length; index++) {
        const element = ablums[index];
        element.addEventListener("click", async (e) => {
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfAlbum = element.querySelector(".albumname").innerHTML
            let rawNameOfAlbum = nameOfAlbum.replaceAll(" ", "%20")
            console.log(nameOfAlbum)
            for (let index = 0; index < albumBgs.length; index++) {
                const source = albumBgs[index];
                if (source.includes(rawNameOfAlbum)) {
                    aapWindow.querySelector(".aapImage").src = `${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML = nameOfAlbum
                    break;
                }
            }
            await openAap(rawNameOfAlbum, aapWindow, songSources, songList)
            let allCards = document.querySelectorAll(".card")
            console.log(allCards);
            playSong(queueSongNames, nextSongs, audioArray, currentSong, allCards, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName)
        })
    }
}

import { addsongToPlist } from "./addSongToPlist.js";
export const playlistManagement = (playlistBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, API_URL) => {
    async function playlistOpenLogic(songSources, songList, nameOfPlaylist, API_URL) {
        let card = document.createElement("div")
        const response = await fetch(`${API_URL}/get-cards`)
        const result = await response.text()
        card.innerHTML = result
        console.log(card);
        const substrings = new Set()
        let hasIt = false
        for (let index = 0; index < songSources.length; index++) {
            const element = songSources[index];
            const realName = decodeURIComponent(element)
            let minLength = 6
            for (let length = minLength; length <= nameOfPlaylist.length; length++) {
                for (let i = 0; i <= nameOfPlaylist.length - length; i++) {
                    const substring = nameOfPlaylist.substring(i, i + minLength)
                    substrings.add(substring)
                }
            }
            for (let length = minLength; length <= realName.length; length++) {
                for (let i = 0; i <= realName.length - length; i++) {
                    const substring1 = realName.substring(i, i + minLength)
                    if (substrings.has(substring1)) {
                        let insertedCard = card.querySelector(".card")
                        insertedCard.querySelector(".songSource").innerHTML = `${songList[index].slice(0, songList[index].indexOf(" -"))}`
                        aapWindow.querySelector(".songsList").insertAdjacentHTML('beforeend', insertedCard.outerHTML)
                        console.log(insertedCard);
                        hasIt = true
                        break;
                    }
                }
                if (hasIt) {
                    break;
                }
            }
            
        }
        let currentCards = document.querySelectorAll(".card")
            for (let index = 0; index < currentCards.length; index++) {
                const element = currentCards[index];
                if (localStorage.getItem("cardClicked") != null && localStorage.getItem("cardClicked") == element.querySelector(".songSource").innerHTML) {
                    element.querySelector(".currentSongCard").src = "/svgs/cardAnime.svg"
                }
                const songCardMenu = element.querySelector(".songCardMenu")
                console.log(element);

                songCardMenu.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("working!");
                    element.querySelector('.songOptions').classList.toggle('noDisplay');
                })
            }
            addsongToPlist()
    }
    let playlists = document.querySelectorAll(".playlist")
    for (let index = 0; index < playlists.length; index++) {
        const element = playlists[index];
        element.addEventListener("click", async (e) => {
            e.preventDefault()
            aapWindow.classList.add("flex")
            aapWindow.classList.add('opaque')
            musicSection.classList.add("noOverflow")
            let nameOfPlaylist = element.querySelector(".playlistname").innerHTML
            let rawNameOfPlaylist = nameOfPlaylist.replaceAll(" ", "%20")
            console.log(nameOfPlaylist)
            for (let index = 0; index < playlistBgs.length; index++) {
                const source = playlistBgs[index];
                if (source.includes(rawNameOfPlaylist)) {
                    aapWindow.querySelector(".aapImage").src = `${source}`
                    aapWindow.querySelector(".actuTitle").innerHTML = nameOfPlaylist
                    break;
                }
            }

            //Saperately creating the code of openAap function for the playlists due to naming complexities: 
            await playlistOpenLogic(songSources, songList, nameOfPlaylist,API_URL)
            let allCards = document.querySelectorAll(".card")
            console.log(allCards);
            playSong(queueSongNames, nextSongs, audioArray, currentSong, allCards, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName)
        })
    }

}