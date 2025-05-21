
import { signup, login, logout, sendOtp, verifyOtp, changePass } from "./authRequests.js"
import { playSong } from "./playSongLogic.js"
import { basicPlaylistCtrls } from "./userplaylistLogics.js"
import { searchLogic } from "./searchScript.js"
import { popOverRedirects } from "./popOverRedirects.js"
import { scrollMangagement } from "./scrollManagement.js"
import { artistsMangaement, albumManagement, playlistManagement } from "./aapWindowManagement.js"
import { prevNextCtrls } from "./playerControls.js"
import { userPlaylistManagement } from "./playlistReqs.js"
import { addsongToPlist } from "./addSongToPlist.js"
//Page Initialization:
let loginBtn = document.querySelector(".login")
let signupBtn = document.querySelector(".signup")
let account = document.querySelector(".account")
let userFullName = account.querySelector(".fullName")
let currentUserName = account.querySelector(".username")
let loggedIn = {
    value: false
}
const library = document.querySelector(".library")
const musicSection = document.querySelector(".musicSection")
const aapWindow = document.querySelector(".aapInfo")

document.addEventListener('DOMContentLoaded', async () => {
    // Removes any previous session data stored in localStorage
    const response = await fetch(`${API_URL}/auth/check-session`, { credentials: "include" })
    const result = await response.json();
    if (!result.loggedIn) {
        console.log("Not logged In");
    }
    else {
        console.log(result);

        library.classList.add("noDisplay")
        aapWindow.style.right = 'unset'
        aapWindow.style.width = '75vw'
        musicSection.style.right = 'unset'
        musicSection.style.width = '100vw'
        musicSection.style.padding = '0px 12.5vw'
        musicSection.style.background = 'linear-gradient(to right, rgb(6 8 7), rgb(34, 34, 34), rgb(17, 17, 17), rgb(10, 10, 10), rgb(17, 17, 17), rgb(34, 34, 34), rgb(6,8,7))'
        loginBtn.classList.add("noDisplay")
        signupBtn.classList.add("noDisplay")
        account.classList.remove("noDisplay")
        userFullName.innerHTML = result.user.fullName
        currentUserName.innerHTML = "@" + result.user.username
        loggedIn.value = true
    }
    console.log("deleting");

    localStorage.removeItem('cardClicked');

});
const API_URL = "http://localhost:3000"
//Important function:
function setPlayerName(nextSong, songSources, songList) {  //Sets the name of the song currently being played in the player
    let nextSongEdited = nextSong.slice(nextSong.indexOf("3000") + 4)
    console.log("running", nextSongEdited);
    let playerSongName = document.querySelector(".nameIs")
    for (let index = 0; index < songSources.length; index++) {
        const element = songSources[index];

        if (nextSongEdited === element) {
            console.log(playerSongName);
            const nameToSet = songList[index]
            playerSongName.innerHTML = nameToSet.slice(0, nameToSet.indexOf(" ["))
            break;
        }
        else {
            playerSongName.innerHTML = ""
        }
    }
}

// Function to set the icon of music on the card of song currently being played dynamically
function setMusicIcon(aapWindow) {
    let playerName = document.querySelector(".nameIs").innerHTML
    let songInPlayer = playerName.slice(0, playerName.indexOf(" -"))
    if (aapWindow.classList.contains("flex")) {

        let cardsInWindow = document.querySelectorAll(".card")

        for (let index = 0; index < cardsInWindow.length; index++) {
            const element = cardsInWindow[index];
            if (element.querySelector(".songSource").innerHTML === songInPlayer) {
                element.querySelector(".currentSongCard").src = "/svgs/cardAnime.svg"
                localStorage.setItem("cardClicked", songInPlayer)
            }
            else {
                element.querySelector(".currentSongCard").src = ""
            }
        }
    }
    else {
        localStorage.setItem("cardClicked", songInPlayer)
    }
}

async function openAap(rawName, aapWindow, songSources, songList) { //Adds the songs of clicked artst album or playlist in the aapWindow area
    let card = document.createElement("div")
    const response = await fetch(`${API_URL}/get-cards`)
    const result = await response.text()
    card.innerHTML = result
    console.log(card);
    for (let index = 0; index < songSources.length; index++) {
        const element = songSources[index];
        if (element.includes(rawName)) {
            let insertedCard = card.querySelector(".card")
            insertedCard.querySelector(".songSource").innerHTML = `${songList[index].slice(0, songList[index].indexOf(" -"))}`
            aapWindow.querySelector(".songsList").insertAdjacentHTML('beforeend', insertedCard.outerHTML)
            console.log(insertedCard);
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
            element.querySelector('.songOptions').classList.toggle('noDisplay');
        })
    }
    addsongToPlist()
    
}

/**
 * Fetches the list of song file URLs from the server.
 * @returns {Promise<Array>} - An array of song file URLs.
 */
async function getSongs() {
    let songsFetched = await fetch("/songs")
    let response = await songsFetched.json()
    console.log(response);
    return response
}
/**
 * Fetches artist background images from the server.
 * @returns {Promise<Array>} - An array of artist background image URLs.
 */
async function getArtistBgs() {
    let bgFeched = await fetch("/artists")
    let response = await bgFeched.json()
    return response
}
/**
 * Fetches album background images from the server.
 * @returns {Promise<Array>} - An array of album background image URLs.
 */
async function getAlbumBgs() {
    let albumBgFetched = await fetch("/albums")
    let response = await albumBgFetched.json()
    return response
}
/**
 * Fetches playlist background images from the server.
 * @returns {Promise<Array>} - An array of playlist background image URLs.
 */
async function getPlaylistBgs() {
    let playlistBgFetched = await fetch("/Playlists")
    let response = await playlistBgFetched.json()
    return response
}

//Main function - initializes the dynamic content.
async function main() {

    // Code for dynamically addig all the songs in their related fields
    let queueSongNames = []
    let nextSongs = []
    let currentSong = []
    let audioArray = []
    let aapWindow = document.querySelector(".aapInfo")
    let playPauseBtn = document.querySelector('.playPause')
    let playPauseSvg = playPauseBtn.querySelector('.playPauseSvg')

    basicPlaylistCtrls(API_URL)
    popOverRedirects()
    scrollMangagement()
    userPlaylistManagement(API_URL)
    let songSources = await getSongs()

    // Getting the Name of songs with their Artist Names:
    let songList = []
    for (const song of songSources) {
        let sliceStart = song.indexOf('s/')
        let sliceEnd = song.indexOf('--')
        let songRawTitle = song.slice(sliceStart + 2, sliceEnd)
        let songTitle = decodeURIComponent(songRawTitle)
        songList.push(songTitle)
    }
    console.log(songList);
    searchLogic(songSources, API_URL, queueSongNames, nextSongs, audioArray, currentSong, songList, playPauseSvg, setPlayerName, musicSection)
    let artistNames = document.querySelectorAll('.artistname')
    let index = 0
    let realArtistNames = []
    artistNames.forEach(name => {
        let nameSliceIndex = songList[index].indexOf("- ")
        realArtistNames.push(songList[index].slice(nameSliceIndex + 2, songList[index].indexOf(" [")))
        name.innerHTML = realArtistNames[index]
        index += 1
    });
    console.log(realArtistNames);

    let artistBgs = await getArtistBgs()
    console.log(artistBgs);

    //Setting the name for the artist section cards
    let bgNameList = []
    for (let i = 0; i < artistBgs.length; i++) {
        let bgSliceStart = artistBgs[i].indexOf("s/")
        let bgSliceEnd = artistBgs[i].indexOf(".j")
        let bgRawTitle = artistBgs[i].slice(bgSliceStart + 2, bgSliceEnd)
        let bgTitle = decodeURIComponent(bgRawTitle)
        bgNameList.push(bgTitle)
    }

    console.log(bgNameList);

    //Setting the background for the aritsts
    let artistBackgrounds = document.querySelectorAll(".artistbg")
    let index2 = 0
    artistBackgrounds.forEach(bg => {
        let j = 0
        for (const bgName of bgNameList) {
            if (bgName == realArtistNames[index2]) {
                bg.style.background = `url(${artistBgs[j]})`
                bg.style.backgroundSize = "cover"
                break;
            }
            j++
        }
        index2++;
    })

    let albumBgs = await getAlbumBgs()
    console.log(albumBgs);

    //Setting the name of the cards in Album Section
    let albumNames = document.querySelectorAll(".albumname")
    let albumTitles = []
    for (const name of albumBgs) {
        let nameSliceStart = name.indexOf('ms/')
        let nameSliceEnd = name.indexOf('.j')
        let rawAlbumTitle = name.slice(nameSliceStart + 3, nameSliceEnd)
        let albumTitle = rawAlbumTitle.replaceAll("%20", " ")
        albumTitles.push(albumTitle)
    }
    console.log(albumTitles);

    let index3 = 0
    albumNames.forEach(element => {
        element.innerHTML = albumTitles[index3].slice(0, albumTitles[index3].indexOf("-"))
        index3++
    });

    //Setting the background image for albums 
    let albumBackgrounds = document.querySelectorAll(".albumbg")
    let index4 = 0
    albumBackgrounds.forEach(element => {
        element.style.background = `url(${albumBgs[index4]})`
        element.style.backgroundSize = "cover"
        index4++
    });


    let playlistBgs = await getPlaylistBgs()
    console.log(playlistBgs);

    //Setting the backgrounds of the playlists
    let playlistBackgrounds = document.querySelectorAll(".playlistbg")
    let index5 = 0
    playlistBackgrounds.forEach(element => {
        element.style.background = `url(${playlistBgs[index5]})`
        element.style.backgroundSize = 'cover'
        index5++
    });

    //Setting the name of the cards in the playlist section
    let playlistNames = document.querySelectorAll(".playlistname")
    let index6 = 0
    for (let i = 0; i < playlistNames.length; i++) {
        const element = playlistNames[i];
        let name = playlistBgs[i]
        let nameSliceStart = name.indexOf('ts/')
        let nameSliceEnd = name.indexOf('.j')
        let rawPlaylistTitle = name.slice(nameSliceStart + 3, nameSliceEnd)
        let playlistTitle = rawPlaylistTitle.replaceAll("%20", " ")
        element.innerHTML = playlistTitle
        index6++
    }

    //Common animation for all the buttons in the site
    let allButtons = document.getElementsByTagName("button")
    for (let index = 0; index < allButtons.length; index++) {
        const element = allButtons[index];
        element.addEventListener('click', () => {
            element.classList.add("buttonClickAnime")
            setTimeout(() => {
                element.classList.remove("buttonClickAnime")
            }, 100);

        })
    }
    //Opens the aapWindow for the clicked artist, album or playlist:
    artistsMangaement(artistBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, openAap)

    albumManagement(albumBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, openAap)

    playlistManagement(playlistBgs, queueSongNames, nextSongs, audioArray, currentSong, playPauseSvg, aapWindow, songSources, songList, loggedIn, setMusicIcon, setPlayerName, musicSection, playSong, API_URL)
    //Event listener  to play or pause the current song:
    playPauseBtn.addEventListener('click', () => {
        if (playPauseSvg.src.includes("/svgs/plays.svg")) {
            if (currentSong.length > 0) {
                playPauseSvg.src = "/svgs/pause.svg"
                currentSong[0].play()
            }
        }
        else if (playPauseSvg.src.includes("/svgs/pause.svg")) {
            playPauseSvg.src = "/svgs/plays.svg"
            currentSong[0].pause()
        }
    })

    //Setting the current time of the song every Second in the player
    let currentTimeElement = document.querySelector(".currentTime")
    let durationElement = document.querySelector(".durationTime")
    let seekBall = document.querySelector(".seekBall")
    let seekBar = document.querySelector(".seekBar")
    function secondsToMinutes(currentTime, duration) {
        let seconds, minutes
        if (currentTime < 60) {
            if (currentTime < 10) {
                currentTimeElement.innerHTML = "00:0" + currentTime
            }
            else {
                currentTimeElement.innerHTML = "00:" + currentTime
            }
        }
        else {
            minutes = Math.floor(currentTime / 60)
            seconds = Math.floor(currentTime - minutes * 60)
            if (minutes < 10) {
                if (seconds < 10) {
                    currentTimeElement.innerHTML = "0" + minutes + ":0" + seconds
                }
                else {
                    currentTimeElement.innerHTML = "0" + minutes + ":" + seconds
                }
            }
            else {
                if (seconds < 10) {
                    currentTimeElement.innerHTML = minutes + ":0" + seconds
                }
                else {
                    currentTimeElement.innerHTML = minutes + ":" + seconds
                }
            }
        }
        seekBall.style.left = (currentTime / duration) * 100 + "%"
        let durationMinutes = Math.floor(duration / 60)
        let durationSeconds = Math.floor(duration - durationMinutes * 60)
        if (durationMinutes < 10) {
            if (durationSeconds < 10) {
                durationElement.innerHTML = "0" + durationMinutes + ":0" + durationSeconds
            }
            else {
                durationElement.innerHTML = "0" + durationMinutes + ":" + durationSeconds
            }
        }
        else {
            if (durationSeconds < 10) {
                durationElement.innerHTML = durationMinutes + ":0" + durationSeconds
            }
            else {
                durationElement.innerHTML = durationMinutes + ":" + durationSeconds
            }
        }
    }

    function playNext(currentSong, audioArray, playPauseSvg, aapWindow) {//Function to play the next song when a song has ended
        if (!currentSong || currentSong.length === 0) {
            return;
        }

        const audio = currentSong[0]; // Assuming currentSong[0] is the active audio element

        // Attaching the `ended` event listener once
        if (!audio.hasEventListener) { // Custom flag to avoid re-adding the listener
            audio.addEventListener("timeupdate", () => {
                secondsToMinutes(Math.floor(audio.currentTime), Math.floor(audio.duration))
            })
            seekBar.addEventListener('click', e => {
                let leftInPer = (e.offsetX / e.target.getBoundingClientRect().width) * 100
                seekBall.style.left = leftInPer + "%"
                let audio = currentSong[0]
                audio.currentTime = (leftInPer * audio.duration) / 100
            })
            audio.addEventListener("ended", () => {
                console.log("Song ended.");
                // Finding the index of the current song in the audioArray
                const currentIndex = audioArray.findIndex(element => element.src === audio.src);

                if (currentIndex >= 0 && currentIndex < audioArray.length - 1) {
                    // Moving to the next song
                    const nextAudio = audioArray[currentIndex + 1];
                    currentSong[0].currentTime = 0
                    currentSong.pop(); // Removed the old audio
                    currentSong.push(nextAudio); // Added the new audio
                    console.log(nextAudio);
                    setPlayerName(nextAudio.src, songSources, songList)
                    nextAudio.play();
                    setMusicIcon(aapWindow)
                    console.log(`Now playing: ${nextAudio.src}`);
                } else {
                    console.log("End of playlist.");
                    playPauseSvg.src = "/svgs/plays.svg"
                    currentSong[0].currentTime = 0
                }
            });

            // Marked listener as added
            audio.hasEventListener = true;
        }
    }
    setInterval(() => {
        playNext(currentSong, audioArray, playPauseSvg, aapWindow);
    }, 1000);


    //Temporary solution for the features which are currently unavailable
    // let anchors = document.getElementsByTagName("a")
    // for (let index = 0; index < anchors.length; index++) {
    //     const element = anchors[index];
    //     element.addEventListener("click", e => {
    //         e.preventDefault()
    //         alert("This feature will be available soon")
    //     })
    // }
    // let formButtons = document.querySelector(".searchbar").getElementsByTagName("button")
    // for (let index = 0; index < formButtons.length; index++) {
    //     const element = formButtons[index];
    //     element.addEventListener("click", e => {
    //         e.preventDefault()
    //         alert("The feature will be available soon")
    //     })
    // }
    // let libraryButtons = document.querySelector(".library").querySelectorAll(".noFunction")
    // let LabBtn = [...libraryButtons]
    // for (let index = 0; index < LabBtn.length; index++) {
    //     const element = LabBtn[index];
    //     element.addEventListener("click", e => {
    //         e.preventDefault()
    //         alert("This feature will be available soon")
    //     })
    // }

    //Event listeners to play previous and next song when the respective button is clicked
    prevNextCtrls(currentSong, songSources, songList, aapWindow, audioArray, setPlayerName, setMusicIcon)

    //Event listener to close the aapWindow when the close(back) button is hit
    let backButton = document.querySelector(".closeAap")
    backButton.addEventListener("click", (e) => {
        e.preventDefault()
        let cardsInWindow = document.querySelectorAll(".card")
        console.log(cardsInWindow);

        for (let index = 0; index < cardsInWindow.length; index++) {
            const element = cardsInWindow[index];
            if (element.querySelector(".currentSongCard").src == "/svgs/cardAnime.svg") {
                localStorage.setItem("cardClicked", element.querySelector("songSource").innerHTML)
                break;
            }
        }
        aapWindow.classList.remove('flex')
        aapWindow.classList.remove('opaque')
        musicSection.classList.remove('noOverflow')
        aapWindow.querySelector(".songsList").innerHTML = ""

    })

    //Event listner to close the parent element when back button is clicked
    let parentCloseBtns = document.querySelectorAll(".closeParent")
    parentCloseBtns.forEach(element => {
        element.addEventListener("click", (e) => {
            e.preventDefault()
            let parent = element.parentElement
            parent.classList.add("noDisplay")
        })
    });
    //Code to maintain the responsiveness of the site by hiding or showing the library according to the media queries
    let menuBtn = document.querySelector(".menu")
    let libsvg = document.querySelector(".libsvg")
    menuBtn.addEventListener('click', () => {
        console.log(library);
        library.style.left = "0px"
        libsvg.src = "/svgs/Back.svg"
        libsvg.style.filter = "invert(0)"
        libsvg.style.height = "2vh"
    })
    const mediaQuery = window.matchMedia("(max-width:1200px)")
    const mediaQuery1 = window.matchMedia("(min-width:1201px)")

    setInterval(() => {
        if (mediaQuery1.matches) {
            library.style.left = "unset"
        }
    }, 500);
    let libCloseBtn = document.querySelector(".librarybutton")
    libCloseBtn.addEventListener("click", () => {
        if (mediaQuery.matches) {
            library.style.left = "-280px"
            libsvg.src = "/svgs/library.svg"
        }
    })

    //Pop Overs maintainance section:

    let mainSection = document.querySelector(".scbvr")
    let popovers = document.querySelectorAll('[popover]')
    popovers.forEach(element => {
        element.addEventListener("toggle", (e) => {
            e.preventDefault()
            if (element.matches(":popover-open")) {
                mainSection.classList.add("disableBg")
            }
            else {
                mainSection.classList.remove("disableBg")
            }
        })
    });
    let forgotPassBtn = document.querySelector(".forgotPass")
    let userNameOnLogin = document.querySelector(".logInUname")
    forgotPassBtn.addEventListener("click", (e) => {
        if (userNameOnLogin.value == "") {
            e.preventDefault()
            alert("Enter Username First.")
            return;
        }
        document.getElementById("logInPopOver").hidePopover()
    })

    // REQUESTS section:
    let loginBtn = document.querySelector(".login")
    let signupBtn = document.querySelector(".signup")
    let account = document.querySelector(".account")
    document.querySelector(".signUpForm").addEventListener('submit', async (e) => {
        e.preventDefault();
        signup("signUpPopOver", userFullName, currentUserName, loginBtn, signupBtn, account, API_URL)
        loggedIn.value = true
    })
    document.querySelector(".logInForm").addEventListener("submit", async (e) => {
        e.preventDefault()
        login("logInPopOver", userFullName, currentUserName, loginBtn, signupBtn, account, API_URL)
        loggedIn.value = true
        console.log(loggedIn);

    })
    document.querySelector(".logoutForm").addEventListener("submit", async (e) => {
        e.preventDefault()
        logout("logoutConfPopOver", userFullName, currentUserName, loginBtn, signupBtn, account, API_URL, currentSong, setPlayerName, songSources, songList)
        loggedIn.value = false
    })
    const resetPassPopover = document.querySelector(".resetPass")
    const otpSendingBtn = document.querySelector(".sendOtp")
    const emailForOtp = otpSendingBtn.previousElementSibling
    const otpVerificationBtn = document.querySelector(".verifyOtp")
    const otpInput = document.querySelector(".otpInput")

    otpSendingBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        sendOtp(otpInput, otpVerificationBtn, otpSendingBtn, API_URL);
    })
    const emailVerificationSection = document.querySelector(".emailVerificationSection")
    const passResetSection = document.querySelector(".passResetSection")
    otpVerificationBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        verifyOtp(otpInput, emailForOtp, emailVerificationSection, passResetSection, otpVerificationBtn, otpSendingBtn, API_URL)
    })
    const passResetForm = document.querySelector(".passwordResetForm")
    passResetForm.addEventListener("submit", async (e) => {
        e.preventDefault()
        changePass(emailVerificationSection, passResetSection, resetPassPopover, API_URL);
    })
    let accInfoElem = document.querySelector(".accInfo")
    document.querySelector(".profile").addEventListener("click", () => {
        accInfoElem.classList.toggle("moved")
    })
}

main()//main function call


document.addEventListener('contextmenu', function (event) {//Event listener to hide the context menu
    event.preventDefault();
});

//Code the make the right and left scrolling butttons functional
const scrollLeftBtn = document.querySelectorAll('.scrollLeft')
const scrollRightBtn = document.querySelectorAll('.scrollRight')
const scroll = 190
scrollLeftBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const scrolledDivLeft = btn.nextElementSibling
        scrolledDivLeft.scrollTo({
            top: 0,
            left: scrolledDivLeft.scrollLeft - scroll,
            brhaviour: 'smooth'
        })
    })

});
scrollRightBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const scrolledDivRight = btn.previousElementSibling
        scrolledDivRight.scrollTo({
            top: 0,
            left: scrolledDivRight.scrollLeft + scroll,
            brhaviour: 'smooth'
        })
    })
});

//Function to detect if the device opening the site is touchscreen or not to hide the scrolling buttons respective to the device
function isTouchScreen() {
    return window.matchMedia("(pointer:coarse)").matches
}
if (isTouchScreen()) {
    document.querySelector(".scrollLeft").classList.add('noDisplay')
    document.querySelector(".scrollRight").classList.add('noDisplay')
}

//Code to add the animation on the play button when we hover on it
const hoverElement = document.querySelectorAll('.hover')
hoverElement.forEach(elem => {
    elem.addEventListener('mouseover', (e) => {
        e.preventDefault()
        const playbtnHover = elem.querySelector('.plays')
        playbtnHover.classList.add('visible')
    })
    elem.addEventListener('mouseout', (e) => {
        e.preventDefault()
        const playbtnHover = elem.querySelector('.plays')
        playbtnHover.classList.remove('visible')
    })
})
