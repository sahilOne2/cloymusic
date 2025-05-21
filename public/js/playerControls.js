export const prevNextCtrls = (currentSong,songSources,songList,aapWindow,audioArray,setPlayerName,setMusicIcon) => {
    let prev = document.querySelector(".previous")
    let next = document.querySelector(".next")
    prev.addEventListener("click", () => {
        if (currentSong[0].src == audioArray[0].src || audioArray.length == 0) {
            currentSong[0].pause()
            currentSong[0].currentTime = 0
            setPlayerName(currentSong[0].src,songSources,songList)
            currentSong[0].play()
            setMusicIcon(aapWindow)
        }
        else {
            for (let index = 0; index < audioArray.length; index++) {
                const element = audioArray[index];
                if (element.src == currentSong[0].src) {
                    currentSong[0].pause()
                    currentSong[0].currentTime = 0
                    currentSong.pop()
                    currentSong.push(audioArray[index - 1])
                    setPlayerName(currentSong[0].src,songSources,songList)
                    currentSong[0].play()
                    setMusicIcon(aapWindow)
                    break;
                }
            }
        }
    })
    next.addEventListener("click", () => {
        if (currentSong[0].src == audioArray[(audioArray.length) - 1].src) {
            currentSong[0].pause()
            currentSong[0].currentTime = 0
            currentSong[0] = audioArray[0]
            currentSong[0].play()
            setPlayerName(currentSong[0].src,songSources,songList)
            setMusicIcon(aapWindow)
        }
        else {
            for (let index = 0; index < audioArray.length; index++) {
                const element = audioArray[index];
                if (element.src == currentSong[0].src) {
                    currentSong[0].pause()
                    currentSong[0].currentTime = 0
                    currentSong.pop()
                    currentSong.push(audioArray[index + 1])
                    currentSong[0].play()

                    setPlayerName(currentSong[0].src,songSources,songList)
                    setMusicIcon(aapWindow)
                    break;
                }
            }
        }
    })

}