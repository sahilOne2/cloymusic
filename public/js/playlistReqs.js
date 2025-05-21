export const userPlaylistManagement =  (API_URL) => {
    const createPlaylistDiv = document.querySelector(".plistCreate")
    const createPlaylistForm = document.querySelector(".playlistForm")
    createPlaylistForm.addEventListener("submit", async function (e) {
        e.preventDefault()
        const formData = new FormData(createPlaylistForm)
        const data = Object.fromEntries(formData.entries())
        console.log(data);
        
        const name = data.playlistName
        const desc = data.playlistDescription

        const response=await fetch(`${API_URL}/plist/create-playlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                desc,
            }),
        })
        const result = await response.json()
        if (result.message === "Playlist created successfully.") {
            alert(result.message)
            createPlaylistDiv.classList.add("noDisplay")
            createPlaylistForm.reset()
        }
        else {
            alert(result.message)
            createPlaylistForm.reset()
        }
        
    })
}
export const fetchUserPlaylists = async (API_URL) => {
    const response = await fetch(`${API_URL}/plist/get-user-playlists`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const result = await response.json()
    if (result.message === "Playlists fetched successfully.") {
        const playlists = result.playlists
        const playlistCard = document.createElement("div")
        const response = await fetch(`${API_URL}/playlist-cards`)
        const plistCardResult = await response.text()
        playlistCard.innerHTML = plistCardResult.toString()
        
        const playlistContainer = document.querySelector(".playlistsContainer")
        playlistContainer.innerHTML = ''
        for (let index = 0; index < playlists.length; index++) {
            const element = playlists[index];
            
            const cardToInsert = playlistCard.querySelector(".playlistCard").cloneNode(true)
            
            cardToInsert.querySelector(".playlistName").innerHTML = element.name
            cardToInsert.querySelector(".playlistDesc").innerHTML = element.desc
            playlistContainer.insertAdjacentElement("beforeend",cardToInsert)   
        }
    }
    else{
        console.log(result.message)
    }
    
}