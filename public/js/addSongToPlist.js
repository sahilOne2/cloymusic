

export const addsongToPlist = () => {
    const body = document.getElementById("body")
    const overlay = document.querySelector(".overlay")

    const addToPlaylistDiv = document.querySelector(".addToPlistDiv")

    const addToPlistBtn = document.querySelector(".addSongToPlaylist")
    addToPlistBtn.addEventListener("click", async (e) => {
        e.preventDefault()
        e.stopPropagation()

        const response = await fetch(`/plist/get-user-playlists`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const result = await response.json()
        console.log(result);
        addToPlaylistDiv.classList.add("playlistForwardAnimation")
        overlay.style.display = 'block'
        const playlistCard = document.createElement("div")
        const playlistResponse = await fetch(`/playlist-cards`)
        const plistCardResult = await playlistResponse.text()
        playlistCard.innerHTML = plistCardResult.toString()

        const playlistContainer = document.querySelector(".addToPlistDiv")
        for (let index = 0; index < result.playlists.length; index++) {
            const element = result.playlists[index];

            const cardToInsert = playlistCard.querySelector(".playlistCard").cloneNode(true)

            cardToInsert.querySelector(".playlistName").innerHTML = element.name
            cardToInsert.querySelector(".playlistDesc").innerHTML = element.desc
            playlistContainer.insertAdjacentElement("beforeend", cardToInsert)
        }

        addToPlaylistDiv.querySelector(".cancelSongAddition").addEventListener("click", (e) => {
            e.preventDefault()
            e.stopPropagation()
            addToPlaylistDiv.classList.remove("playlistForwardAnimation")
            addToPlaylistDiv.classList.add("playlistBackwardAnimation")
            const keep = addToPlaylistDiv.firstElementChild
            while (addToPlaylistDiv.lastElementChild !== keep) {
                addToPlaylistDiv.removeChild(addToPlaylistDiv.lastElementChild)
            }
            overlay.style.display = 'none'
            setTimeout(() => {
                addToPlaylistDiv.classList.remove("playlistBackwardAnimation")
            }, 500)
        })

        const playlistCards = document.querySelectorAll(".playlistCard")
        playlistCards.forEach(element => {
            element.style.width = "100%"
        });



    })
}
