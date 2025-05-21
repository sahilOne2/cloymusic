
import { fetchUserPlaylists } from "./playlistReqs.js"

export function basicPlaylistCtrls(API_URL) {
    const accMyPlaylists = document.querySelector(".myPlaylists")
    accMyPlaylists.addEventListener("click", function (e) {
        e.preventDefault()
        fetchUserPlaylists(API_URL)
        const myPlaylistsDiv = document.querySelector(".userPlaylists")
        myPlaylistsDiv.classList.remove("noDisplay")
    })
    const playlistContainer = document.querySelector(".playlistsContainer")

    if (playlistContainer.innerHTML === '') {
        playlistContainer.innerHTML = "<p class='noPlaylists'>No playlists created yet!</p>"
    }
    const createplistForm = document.querySelector(".playlistForm")
    const addNewPlaylistBtn = document.querySelector(".addNew")
    addNewPlaylistBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const plistCreateDiv = document.querySelector(".plistCreate")
        plistCreateDiv.classList.remove("noDisplay")
    })


    const cancelBtn = document.querySelector(".plistCancel")
    cancelBtn.addEventListener("click", function (e) {
        e.preventDefault()
        const plistCreateDiv = document.querySelector(".plistCreate")
        createplistForm.reset()
        plistCreateDiv.classList.toggle("noDisplay")
    })

}