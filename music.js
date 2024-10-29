const audioFiles = [
    { src: "https://files.catbox.moe/cqawfd.mp3" },
];

let currentTrack = 0;
const music = new Audio(audioFiles[currentTrack].src);
music.muted = false;
music.preload = "auto";

// Play music on first screen press and remove event listeners
function playMusicOnce() {
    music.play()
        .then(() => {
            console.log("Now playing:", audioFiles[currentTrack].src);
        })
        .catch(error => console.error("Playback failed:", error));

    // Remove event listeners after first play
    document.body.removeEventListener("click", playMusicOnce);
    document.body.removeEventListener("touchstart", playMusicOnce);
}

// Add click and touchstart listeners for initial play
document.body.addEventListener("click", playMusicOnce);
document.body.addEventListener("touchstart", playMusicOnce);
